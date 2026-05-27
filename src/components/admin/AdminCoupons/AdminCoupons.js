// src/components/admin/AdminCoupons/AdminCoupons.js
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Table, Button, Modal, Form, Input, Select, InputNumber,
  Switch, Tag, Tooltip, Space, DatePicker, message, Popconfirm,
  Card, Statistic, Row, Col, Divider, Badge, Empty, Spin
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  BarChartOutlined, TagOutlined, CopyOutlined,
  CheckCircleOutlined, StopOutlined, ReloadOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import AdminLayout from "../AdminLayout/AdminLayout";
import "./AdminCoupons.css";

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// ─── Rule type options ─────────────────────────────────────────────────────────
const RULE_TYPES = [
  { value: "new_user",           label: "New Users Only" },
  { value: "category",           label: "Must Include Category (Any Amount)" },
  { value: "category_min_value", label: "Category Minimum Spend (₹)" },
];

const RULE_PLACEHOLDERS = {
  new_user:           '{}',
  category:           '{"category_ids": [1, 2]}',
  category_min_value: '{"requirements": [{"category_id": 1, "min_value": 5000}]}',
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminCoupons() {
  const { apiurl, access_token } = useSelector((s) => s.auth);

  const [coupons, setCoupons]             = useState([]);
  const [loading, setLoading]             = useState(false);
  const [modalOpen, setModalOpen]         = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [saving, setSaving]               = useState(false);
  const [analytics, setAnalytics]         = useState(null);
  const [analyticsModal, setAnalyticsModal] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [rules, setRules]                 = useState([]);
  const [categories, setCategories]       = useState([]);
  const [products, setProducts]           = useState([]);
  const [form]                            = Form.useForm();

  const headers = { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" };

  // ── Fetch all coupons ──────────────────────────────────────────────────────
  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${apiurl}/api-admin/coupons/`, { headers });
      const data = await res.json();
      if (res.ok) setCoupons(Array.isArray(data) ? data : []);
      else message.error("Failed to load coupons.");
    } catch {
      message.error("Network error.");
    } finally {
      setLoading(false);
    }
  }, [apiurl, access_token]);

  const fetchCategories = useCallback(async () => {
    if (!access_token) return;
    try {
      const res = await fetch(`${apiurl}/api-admin/categories/`, { headers });
      const data = await res.json();
      if (res.ok) {
        setCategories(data);
        console.log("DEBUG: Categories loaded", data.length);
      } else {
        const err = `Categories error: ${res.status} ${JSON.stringify(data)}`;
        console.error(err);
        message.error(err);
      }
    } catch (e) { 
      message.error(`Categories network error: ${e.message}`);
    }
  }, [apiurl, access_token]);

  const fetchProducts = useCallback(async () => {
    if (!access_token) return;
    try {
      const res = await fetch(`${apiurl}/api-admin/products-minimal/`, { headers });
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
        console.log("DEBUG: Products loaded", data.length);
      } else {
        const err = `Products search error: ${res.status} ${JSON.stringify(data)}`;
        console.error(err);
        message.error(err);
      }
    } catch (e) { 
      message.error(`Products network error: ${e.message}`);
    }
  }, [apiurl, access_token]);

  useEffect(() => {
    if (access_token) {
      fetchCoupons();
      fetchCategories();
      fetchProducts();
    }
  }, [access_token, fetchCoupons, fetchCategories, fetchProducts]);

  // ── Open create/edit modal ─────────────────────────────────────────────────
  const openCreate = () => {
    setEditingCoupon(null);
    setRules([]);
    form.resetFields();
    form.setFieldsValue({ is_active: true, is_stackable: false, discount_type: "flat" });
    setModalOpen(true);
  };

  const openEdit = (coupon) => {
    console.log("DEBUG: Editing coupon, rules:", coupon.rules);
    // Re-fetch to ensure dropdowns are populated
    fetchCategories();
    fetchProducts();

    setEditingCoupon(coupon);
    setRules(coupon.rules || []);
    form.setFieldsValue({
      code:              coupon.code,
      name:              coupon.name,
      description:       coupon.description,
      discount_type:     coupon.discount_type,
      discount_value:    parseFloat(coupon.discount_value),
      max_discount_cap:  coupon.max_discount_cap ? parseFloat(coupon.max_discount_cap) : null,
      min_cart_value:    parseFloat(coupon.min_cart_value),
      global_usage_limit: coupon.global_usage_limit,
      per_user_usage_limit: coupon.per_user_usage_limit,
      date_range:        [dayjs(coupon.start_date), dayjs(coupon.end_date)],
      is_active:         coupon.is_active,
      is_stackable:      coupon.is_stackable,
      payment_methods:   coupon.payment_methods || [],
      applicable_to:     coupon.applicable_to,
    });
    setModalOpen(true);
  };

  // ── Save (create or update) ────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      // Validate & Prepare rules
      const preparedRules = rules.map((r) => {
        let val = r.rule_value;
        if (typeof val === "string") {
          try { val = JSON.parse(val); } catch (e) {
            message.error(`Invalid JSON in rule: ${r.rule_type}`);
            throw e;
          }
        }
        return { rule_type: r.rule_type, rule_value: val };
      });

      const [start, end] = values.date_range || [];
      const payload = {
        code:               values.code.toUpperCase().trim(),
        name:               values.name,
        description:        values.description || "",
        discount_type:      values.discount_type,
        discount_value:     values.discount_value,
        max_discount_cap:   values.max_discount_cap || null,
        min_cart_value:     values.min_cart_value || 0,
        global_usage_limit: values.global_usage_limit || null,
        per_user_usage_limit: values.per_user_usage_limit || 1,
        start_date:         start?.toISOString(),
        end_date:           end?.toISOString(),
        is_active:          values.is_active,
        is_stackable:       values.is_stackable,
        payment_methods:    values.payment_methods || [],
        applicable_to:      values.applicable_to || "all",
        rules:              preparedRules,
      };

      const url    = editingCoupon ? `${apiurl}/api-admin/coupons/${editingCoupon.id}/` : `${apiurl}/api-admin/coupons/`;
      const method = editingCoupon ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      const data   = await res.json();

      if (res.ok) {
        message.success(editingCoupon ? "Coupon updated!" : "Coupon created!");
        setModalOpen(false);
        fetchCoupons();
      } else {
        message.error(JSON.stringify(data));
      }
    } catch (e) {
      if (e?.errorFields) return; // antd validation error
      message.error("Failed to save coupon.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${apiurl}/api-admin/coupons/${id}/`, { method: "DELETE", headers });
      if (res.ok || res.status === 204) {
        message.success("Coupon deleted.");
        fetchCoupons();
      } else {
        message.error("Failed to delete.");
      }
    } catch {
      message.error("Network error.");
    }
  };

  // ── Toggle active ──────────────────────────────────────────────────────────
  const handleToggle = async (coupon) => {
    try {
      const res  = await fetch(`${apiurl}/api-admin/coupons/${coupon.id}/toggle/`, { method: "PATCH", headers });
      const data = await res.json();
      if (res.ok) {
        message.success(`Coupon ${data.is_active ? "enabled" : "disabled"}.`);
        fetchCoupons();
      }
    } catch { message.error("Toggle failed."); }
  };

  // ── Analytics ──────────────────────────────────────────────────────────────
  const openAnalytics = async (coupon) => {
    setAnalyticsLoading(true);
    setAnalyticsModal(true);
    try {
      const res  = await fetch(`${apiurl}/api-admin/coupons/${coupon.id}/analytics/`, { headers });
      const data = await res.json();
      if (res.ok) setAnalytics(data);
      else message.error("Failed to load analytics.");
    } catch { message.error("Network error."); }
    finally { setAnalyticsLoading(false); }
  };

  // ── Copy code ─────────────────────────────────────────────────────────────
  const copyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => message.success(`Copied: ${code}`));
  };

  // ── Rules editor ──────────────────────────────────────────────────────────
  const addRule = () =>
    setRules([...rules, { rule_type: "new_user", rule_value: "{}" }]);

  const removeRule = (idx) =>
    setRules(rules.filter((_, i) => i !== idx));

  const updateRule = (idx, field, val) => {
    setRules(rules.map((r, i) => {
      if (i !== idx) return r;
      
      let newVal = val;
      if (field === "rule_type") {
        // When type changes, reset value to a valid default for that type
        if (val === "category") newVal = '{"category_ids": []}';
        else if (val === "category_min_value") newVal = '{"requirements": []}';
        else newVal = RULE_PLACEHOLDERS[val];
        return { ...r, rule_type: val, rule_value: newVal };
      }
      
      return { ...r, [field]: val };
    }));
  };

  // ── Table columns ─────────────────────────────────────────────────────────
  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code) => (
        <Space>
          <span className="coupon-code-badge">{code}</span>
          <Tooltip title="Copy code">
            <CopyOutlined className="copy-icon" onClick={() => copyCode(code)} />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name, r) => (
        <div>
          <div className="coupon-name">{name}</div>
          <div className="coupon-desc">{r.description?.slice(0, 40)}{r.description?.length > 40 ? "…" : ""}</div>
        </div>
      ),
    },
    {
      title: "Discount",
      key: "discount",
      render: (_, r) => (
        <Tag color={r.discount_type === "flat" ? "blue" : "purple"}>
          {r.discount_type === "flat" ? `₹${r.discount_value}` : `${r.discount_value}%`}
          {r.max_discount_cap ? ` (max ₹${r.max_discount_cap})` : ""}
        </Tag>
      ),
    },
    {
      title: "Usage",
      key: "usage",
      render: (_, r) => (
        <span className="usage-text">
          {r.global_usage_limit ? `∞ ${r.global_usage_limit}` : "Unlimited"} &nbsp;|&nbsp; {r.per_user_usage_limit}/user
        </span>
      ),
    },
    {
      title: "Validity",
      key: "dates",
      render: (_, r) => (
        <div className="date-text">
          <div>{dayjs(r.start_date).format("DD MMM YYYY")}</div>
          <div className="to-text">↓</div>
          <div>{dayjs(r.end_date).format("DD MMM YYYY")}</div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, r) => (
        <Badge
          status={r.is_active ? "success" : "default"}
          text={r.is_active ? "Active" : "Inactive"}
        />
      ),
    },
    {
      title: "Rules",
      key: "rules",
      render: (_, r) =>
        r.rules?.length > 0
          ? r.rules.map((rule, i) => (
              <Tag key={i} color="geekblue" style={{ marginBottom: 2 }}>
                {rule.rule_type}
              </Tag>
            ))
          : <span className="no-rules">No rules</span>,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 200,
      render: (_, r) => (
        <Space size="small">
          <Tooltip title={r.is_active ? "Disable" : "Enable"}>
            <Button
              size="small"
              icon={r.is_active ? <StopOutlined /> : <CheckCircleOutlined />}
              onClick={() => handleToggle(r)}
              className={r.is_active ? "btn-disable" : "btn-enable"}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} className="btn-edit" />
          </Tooltip>
          <Tooltip title="Analytics">
            <Button size="small" icon={<BarChartOutlined />} onClick={() => openAnalytics(r)} className="btn-analytics" />
          </Tooltip>
          <Popconfirm
            title="Delete this coupon?"
            description="This cannot be undone."
            onConfirm={() => handleDelete(r.id)}
            okText="Delete"
            okType="danger"
          >
            <Button size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <div className="admin-coupons-page">
        {/* Header */}
        <div className="coupons-header">
          <div className="coupons-header-left">
            <TagOutlined className="coupons-icon" />
            <div>
              <h1 className="coupons-title">Coupon Management</h1>
              <p className="coupons-sub">Create, manage and track promo codes</p>
            </div>
          </div>
          <Button
            id="create-coupon-btn"
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreate}
            className="create-coupon-btn"
            size="large"
          >
            Create Coupon
          </Button>
        </div>

        {/* Summary Stats */}
        <Row gutter={[16, 16]} className="stats-row">
          <Col xs={12} sm={6}>
            <Card className="stat-card">
              <Statistic title="Total Coupons" value={coupons.length} prefix={<TagOutlined />} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="stat-card">
              <Statistic
                title="Active"
                value={coupons.filter((c) => c.is_active).length}
                valueStyle={{ color: "#52c41a" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="stat-card">
              <Statistic
                title="Inactive"
                value={coupons.filter((c) => !c.is_active).length}
                valueStyle={{ color: "#ff4d4f" }}
                prefix={<StopOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="stat-card">
              <Statistic
                title="With Rules"
                value={coupons.filter((c) => c.rules?.length > 0).length}
                prefix={<BarChartOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Card className="coupons-table-card">
          <Table
            loading={loading}
            dataSource={coupons}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10, showTotal: (t) => `${t} coupons` }}
            scroll={{ x: 1100 }}
            locale={{ emptyText: <Empty description="No coupons yet. Create one!" /> }}
            rowClassName={(r) => (!r.is_active ? "row-inactive" : "")}
          />
        </Card>

        {/* ── Create / Edit Modal ──────────────────────────────────────────── */}
        <Modal
          title={
            <div className="modal-title">
              <TagOutlined /> &nbsp;{editingCoupon ? "Edit Coupon" : "Create New Coupon"}
            </div>
          }
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onOk={handleSave}
          okText={saving ? "Saving…" : editingCoupon ? "Update" : "Create"}
          confirmLoading={saving}
          width={720}
          className="coupon-modal"
          destroyOnClose
        >
          <Form form={form} layout="vertical" className="coupon-form">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="code" label="Coupon Code" rules={[{ required: true, message: "Code is required" }]}>
                  <Input
                    placeholder="e.g. SAVE200"
                    style={{ textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}
                    maxLength={20}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="name" label="Display Name" rules={[{ required: true }]}>
                  <Input placeholder="e.g. Flat ₹200 off" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="description" label="Description">
              <TextArea rows={2} placeholder="Short description shown to users" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="discount_type" label="Discount Type" rules={[{ required: true }]}>
                  <Select>
                    <Option value="flat">Flat (₹)</Option>
                    <Option value="percentage">Percentage (%)</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="discount_value" label="Discount Value" rules={[{ required: true }]}>
                  <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. 200" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="max_discount_cap" label="Max Cap (₹) — % only">
                  <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. 500" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="global_usage_limit" label="Global Usage Limit">
                  <InputNumber min={1} style={{ width: "100%" }} placeholder="Unlimited" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="per_user_usage_limit" label="Per-User Limit">
                  <InputNumber min={1} style={{ width: "100%" }} placeholder="1" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="date_range" label="Valid From → To" rules={[{ required: true, message: "Dates required" }]}>
              <RangePicker showTime style={{ width: "100%" }} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="applicable_to" label="Applicable To">
                  <Select placeholder="all">
                    <Option value="all">All Products</Option>
                    <Option value="categories">Specific Categories (Global)</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="payment_methods" label="Payment Methods (blank = all)">
                  <Select mode="multiple" placeholder="Leave blank for all">
                    <Option value="phonePe">PhonePe</Option>
                    <Option value="COD">COD</Option>
                    <Option value="UPI">UPI</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="is_active" label="Active" valuePropName="checked">
                  <Switch checkedChildren="Yes" unCheckedChildren="No" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="is_stackable" label="Stackable with other coupons?" valuePropName="checked">
                  <Switch checkedChildren="Yes" unCheckedChildren="No" />
                </Form.Item>
              </Col>
            </Row>

            {/* Rules section */}
            <Divider orientation="left" className="rules-divider">
              Advanced Rules
            </Divider>

            {rules.map((rule, idx) => {
              const takesCategory = rule.rule_type === "category";
              const takesCategoryMin = rule.rule_type === "category_min_value";
              
              let currentValues = [];
              let requirements = [];
              
              try {
                const val = rule.rule_value;
                const parsed = (typeof val === "string" && val.length > 0) ? JSON.parse(val) : val;
                if (parsed && typeof parsed === "object") {
                  if (takesCategory) currentValues = (parsed.category_ids || []);
                  if (takesCategoryMin) requirements = (parsed.requirements || []);
                }
                currentValues = Array.isArray(currentValues) ? currentValues.map(v => Number(v)) : [];
              } catch (e) { currentValues = []; requirements = []; }

              return (
                <div key={idx} className="rule-row">
                  <Select
                    value={rule.rule_type}
                    onChange={(v) => updateRule(idx, "rule_type", v)}
                    style={{ width: 190, flexShrink: 0 }}
                  >
                    {RULE_TYPES.map((rt) => (
                      <Option key={rt.value} value={rt.value}>{rt.label}</Option>
                    ))}
                  </Select>

                  {takesCategory ? (
                    <Select
                      mode="multiple"
                      placeholder="Select categories"
                      style={{ flexGrow: 1 }}
                      value={currentValues}
                      options={categories.map(c => ({ label: c.name, value: c.id }))}
                      onChange={(ids) => updateRule(idx, "rule_value", JSON.stringify({ category_ids: ids }))}
                    />
                  ) : takesCategoryMin ? (
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {requirements.map((req, rIdx) => (
                        <Space key={rIdx}>
                          <Select
                            placeholder="Category"
                            style={{ width: 150 }}
                            value={req.category_id}
                            options={categories.map(c => ({ label: c.name, value: c.id }))}
                            onChange={(id) => {
                              const newReqs = [...requirements];
                              newReqs[rIdx] = { ...newReqs[rIdx], category_id: id };
                              updateRule(idx, "rule_value", JSON.stringify({ requirements: newReqs }));
                            }}
                          />
                          <InputNumber
                            placeholder="Min Value"
                            value={req.min_value}
                            onChange={(val) => {
                              const newReqs = [...requirements];
                              newReqs[rIdx] = { ...newReqs[rIdx], min_value: val };
                              updateRule(idx, "rule_value", JSON.stringify({ requirements: newReqs }));
                            }}
                          />
                          <Button size="small" danger onClick={() => {
                            const newReqs = requirements.filter((_, i) => i !== rIdx);
                            updateRule(idx, "rule_value", JSON.stringify({ requirements: newReqs }));
                          }}>×</Button>
                        </Space>
                      ))}
                      <Button size="small" type="dashed" onClick={() => {
                        const newReqs = [...requirements, { category_id: null, min_value: 0 }];
                        updateRule(idx, "rule_value", JSON.stringify({ requirements: newReqs }));
                      }}>+ Add Requirement</Button>
                    </div>
                  ) : (
                    <Input
                      value={rule.rule_value}
                      onChange={(e) => updateRule(idx, "rule_value", e.target.value)}
                      placeholder={RULE_PLACEHOLDERS[rule.rule_type]}
                      className="rule-value-input"
                      style={{ fontFamily: "monospace", fontSize: 12, flexGrow: 1 }}
                    />
                  )}
                  <Button danger size="small" onClick={() => removeRule(idx)} style={{ flexShrink: 0 }}>✕</Button>
                </div>
              );
            })}

            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addRule}
              block
              className="add-rule-btn"
            >
              Add Rule
            </Button>
          </Form>
        </Modal>

        {/* ── Analytics Modal ──────────────────────────────────────────────── */}
        <Modal
          title={<div className="modal-title"><BarChartOutlined /> &nbsp;Coupon Analytics</div>}
          open={analyticsModal}
          onCancel={() => setAnalyticsModal(false)}
          footer={null}
          width={520}
        >
          {analyticsLoading ? (
            <div className="analytics-loading"><Spin size="large" /></div>
          ) : analytics ? (
            <div className="analytics-content">
              <div className="analytics-code">{analytics.code}</div>
              <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                <Col span={12}>
                  <Card className="analytics-stat-card">
                    <Statistic title="Reserved" value={analytics.total_reservations} suffix="uses" />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card className="analytics-stat-card confirmed">
                    <Statistic
                      title="Confirmed (Paid)"
                      value={analytics.total_confirmed}
                      valueStyle={{ color: "#52c41a" }}
                      suffix="orders"
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card className="analytics-stat-card released">
                    <Statistic
                      title="Released (Abandoned)"
                      value={analytics.total_released}
                      valueStyle={{ color: "#fa8c16" }}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card className="analytics-stat-card savings">
                    <Statistic
                      title="Total Savings Given"
                      value={`₹${parseFloat(analytics.total_savings_distributed || 0).toFixed(0)}`}
                      valueStyle={{ color: "#7c4dff" }}
                    />
                  </Card>
                </Col>
              </Row>
              <div className="conversion-bar-wrapper">
                <div className="conversion-label">
                  Conversion Rate: <strong>{analytics.conversion_rate_percent}%</strong>
                </div>
                <div className="conversion-bar-bg">
                  <div
                    className="conversion-bar-fill"
                    style={{ width: `${analytics.conversion_rate_percent}%` }}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </AdminLayout>
  );
}
