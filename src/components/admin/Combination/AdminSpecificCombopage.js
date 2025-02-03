import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  Image,
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  Select,
  Upload,
  message,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  fetchCombinationById,
  updateCombination,
  deleteCombination,
  fetchProducts,
} from "../../../store/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import "./AdminSpecificComboPage.css";
import { Link } from "react-router-dom";
import Main from "../AdminLayout/AdminLayout";
import uparrow from "./uparrow.svg";
import downarrow from "./uparrow.svg";
import Loader from "../../Loader/Loader";

const { Option } = Select;

const AdminSpecificCombopage = () => {
  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const { singlecombination, products, productsloading,singlecombinationloading ,updateCombinationloading,deleteCombinationloading} = useSelector(
    (state) => state.products
  );
  // console.log("products", products);
  const navigate = useNavigate();
  const { id } = useParams();

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [arrayimgs, setarrayimgs] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchCombinationById({ apiurl, id }));
      dispatch(fetchProducts());
    }
  }, [dispatch, apiurl, id]);

  useEffect(() => {
    if (singlecombination) {
      form.setFieldsValue({
        combination_name: singlecombination.combination_name,
        combination_is_active: singlecombination.combination_is_active,
        combination_is_special_collection:
          singlecombination.combination_is_special_collection,
        items: singlecombination.items?.map((item) => item.item.id),
      });
      const formattedImages = singlecombination?.images?.map((image) => ({
        uid: image.id, // Unique identifier for the file
        name: image.image.split("/").pop(), // Extract filename from URL
        url: `${apiurl}${image.image}`, // Full image URL
        status: "done", // Status for displaying as an uploaded file
      }));
      setFileList(formattedImages || []);
    }
  }, [singlecombination, form, apiurl]);

  useEffect(() => {
    if (!singlecombinationloading || productsloading) {
      setarrayimgs(
        singlecombination?.images?.map((imageobj) => imageobj.image)
      );
    }
  }, [singlecombination, dispatch]);
  // console.log("arrayimages", arrayimgs);

  const result =
    singlecombination?.items?.map(({ item }, index) => {
      const firstColor = item.product_colors[0]?.color?.name || "No color";
      const itemname = item.product_colors[0]?.product || "No name";
      const firstImage = item.product_colors[0]?.images[0]?.image || "No image";

      const id = item.id;
      const type = item.type;

      const prices = item.product_colors.map((pc) => Number(pc.price) || 0);
      const minPrice = Math.min(...prices);
      const price = `${minPrice}`;

      return {
        key: index,
        firstColor,
        firstImage,
        itemname,
        price,
        id,
        type,
      };
    }) || [];

  const minPrice =
    singlecombination?.items
      ?.flatMap((item) =>
        item.item.product_colors.map((pc) => Number(pc.price) || Infinity)
      )
      .reduce((min, price) => Math.min(min, price), Infinity) || 0;

  const totalPrice =
    singlecombination?.items
      ?.flatMap((item) =>
        item.item.product_colors.map((pc) => Number(pc.price) || 0)
      )
      .reduce((sum, price) => sum + price, 0) || 0;



     
  const columns = [
    {
      dataIndex: "firstImage",
      key: "firstImage",
      render: (image, record) => {
        return (
          <Link to={`/inventory/product/${record.id}`}>
            <div style={{ width: "200px" }}>
              <Image src={`${apiurl}${image}`} alt="Product" width={80} />
            </div>
          </Link>
        );
      },
    },
    {
      dataIndex: "itemname",
      key: "itemname",
      render: (text, record) => {
        return (
          <div style={{ width: "200px" }}>
            <Link to={`/inventory/product/${record.id}`}>
              <strong>{record.itemname}</strong>
            </Link>
            <br />
            <span style={{ color: "#888" }}>{record.firstColor}</span>
            <span style={{ color: "#888" }}>{record.id}</span>
          </div>
        );
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => (
        <div>
          <strong>
            ₹{record.price}/- Per {record.type === "product" ? "unit" : "meter"}
          </strong>
        </div>
      ),
    },
  ];

  const [imgno, setImgno] = useState(0);

  const handleimges = (idx) => {
    // console.log("idx", idx);
    // console.log("index", idx);
    setImgno(idx);
  };

  const handleUparrow = () => {
    // console.log("imgno", imgno);
    if (imgno > 0) {
      setImgno(imgno - 1);
    } else if (imgno <= 0) {
      setImgno(imgno + arrayimgs.length - 1);
    }
  };
  const handleDownarrow = () => {
    // console.log("imgno", imgno);
    if (imgno < arrayimgs.length - 1) {
      setImgno(imgno + 1);
    } else if (imgno >= arrayimgs.length - 1) {
      setImgno(0);
    }
  };

  const handleUpdate = () => {
    setIsUpdateModalVisible(true);
  };

  const handleDelete = () => {
    dispatch(deleteCombination({ access_token, id }))
      .unwrap()
      .then(() => {
        message.success("Combination deleted successfully!");
        navigate("/admincombinations");
      })
      .catch(() => {
        message.error("Combination not deleted ");
      });
  };

  const handleUpdateSubmit = async (values) => {
    const formData = new FormData();
    formData.append("combination_name", values.combination_name);
    formData.append(
      "combination_is_active",
      values.combination_is_active || false
    );
    formData.append(
      "combination_is_special_collection",
      values.combination_is_special_collection
    );
    formData.append("items", JSON.stringify(values.items));

    const processedFiles = await Promise.all(
      fileList.map(async (file) => {
        if (file.originFileObj) {
          // Already a File object, use it directly
          return file.originFileObj;
        } else if (file.url) {
          // Fetch the file from the URL and convert it to a File object
          const response = await fetch(file.url);
          const blob = await response.blob();
          return new File(
            [blob],
            file.name || `existing_image_${fileList.indexOf(file)}`, // Use file name or generate one
            { type: blob.type } // Use the correct MIME type
          );
        }
        return null; // Ignore invalid files
      })
    );

    // Append each processed file to FormData
    processedFiles.forEach((file) => {
      if (file) {
        formData.append("images", file); // Append the file (now a File object or Blob) to FormData
      }
    });

    try {
      await dispatch(updateCombination({ formData, access_token, id }))
        .unwrap()
        .then(() => {
          message.success("Combination updated successfully!");
          setIsUpdateModalVisible(false);
          dispatch(fetchCombinationById({ apiurl, id }));
        });
    } catch (error) {
      message.error("Failed to update combination");
    }
  };

  const handleFileChange = ({ fileList }) => {
    // console.log("fileList", fileList);
    setFileList(fileList);
  };



  if(singlecombinationloading ){
    return <Loader/>
  }

  return (
    <Main>
      <div className="singlecombination_container">
        <div className="images_arrow">
          <div className="images_container">
            {arrayimgs?.map((img, index) => (
              <img
                key={index}
                src={`${apiurl}${img}`}
                className={`nav_imgs ${imgno === index ? "selected_img" : ""}`}
                alt={`Nav ${index}`}
                onClick={() => handleimges(index)}
              />
            ))}
          </div>

          <div className="arrows_container">
            <img
              src={uparrow}
              className="arrowimages"
              onClick={handleUparrow}
            />
            <img
              src={downarrow}
              className="down_arrow arrowimages"
              onClick={handleDownarrow}
            />{" "}
          </div>
        </div>
        <div className="singlecombination_container">
          {singlecombination ? (
            <>
              <div className="singlecombination_image">
                <h1>{singlecombination.combination_name}</h1>
                <img
                  style={{ width: "350px" }}
                  src={`${apiurl}${arrayimgs?.[imgno]}`}
                  alt={singlecombination.combination_name}
                />
              </div>
              <div className="Combination_items">
                <Table
                  className="Combination_items_table"
                  style={{ height: "100%", margin: "0 auto" }}
                  dataSource={result}
                  columns={columns}
                  pagination={false}
                  width={50}
                />
                <Button type="primary" onClick={handleUpdate} style={{marginRight:"10px"}} loading={updateCombinationloading}>
                  Update
                </Button>

                <Button danger className="combo-delte" onClick={handleDelete} loading={deleteCombinationloading}>
                  Delete
                </Button>
              </div>
              <Modal
                title="Update Combination"
                open={isUpdateModalVisible}
                onCancel={() => setIsUpdateModalVisible(false)}
                footer={null}
              >
                <Form
                  form={form}
                  onFinish={handleUpdateSubmit}
                  layout="vertical"
                >
                  <Form.Item
                    name="combination_name"
                    label="Combination Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input the combination name!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter combination name" />
                  </Form.Item>
                  <Form.Item
                    name="combination_is_special_collection"
                    valuePropName="checked"
                  >
                    <Checkbox>Special Collection</Checkbox>
                  </Form.Item>
                  <Form.Item
                    name="combination_is_active"
                    valuePropName="checked" // Ensure valuePropName is correctly bound
                  >
                    <Checkbox>Is Active</Checkbox>
                  </Form.Item>
                  <Form.Item
                    name="items"
                    label="Items"
                    rules={[
                      {
                        required: true,
                        message: "Please select at least one product!",
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select products"
                      allowClear
                    >
                      {products?.map((product) => (
                        <Option key={product.id} value={product.id}>
                          {product.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Upload Images" className="form-item">
                    <Upload
                      listType="picture-card"
                      fileList={fileList} // Bind the state to the Upload component
                      onChange={handleFileChange} // Update the state on change
                      beforeUpload={() => false} // Prevent automatic upload
                    >
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </Form.Item>
                  
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={updateCombinationloading}>
                      Update Combination
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            </>
          ) : (
            <p>Loading combination details...</p>
          )}
        </div>
      </div>
    </Main>
  );
};

export default AdminSpecificCombopage;
