import React, { useEffect, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  // Card,
  // Col,
  // Row,
  // Modal,
  Form,
  Input,
  Select,
  Space,
  InputNumber,
  Upload,
  Checkbox,
  message,
} from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import {
  // deleteProduct,
  // fetchProducts,
  updateProduct,
} from "../../store/productsSlice";
// import { Link } from "react-router-dom";
import Main from "./AdminLayout/AdminLayout";
import { fetchColors } from "../../store/colorsSlice";
import { fetchCategory } from "../../store/catogerySlice";
import Loader from "../Loader/Loader";
import TextArea from "antd/es/input/TextArea";

const UpdateProduct = () => {
  const { id } = useParams();
  
  const navigate = useNavigate();
  const { access_token, apiurl } = useSelector((state) => state.auth);
  const [singleproduct, setSingleProduct] = useState({});
  const [updatingloading, setupdatingloading] = useState(false);
  const [categoryType, setCategoryType] = useState();
  const location = useLocation();

  // const [isprebook, setIsPrebook] = useState(false);

  const dispatch = useDispatch();
  // const { loading, error } = useSelector((state) => state.products);
  const [colorFields, setColorFields] = useState([]);
  // const [isModalVisible, setIsModalVisible] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProductId({ id, apiurl });
  }, [id, apiurl]);

  useEffect(() => {
    dispatch(fetchColors({ apiurl }));
    dispatch(fetchCategory({ apiurl }));
  }, [dispatch, apiurl]);

  useEffect(() => {
    if (singleproduct) {
      // singleproduct.product_colors?.map((color) => {
      //   console.log("id", color.color.id);
      //   console.log("eligible", color.pre_book_eligible);
      //   console.log("quantity", color.pre_book_quantity);
      // });
      const initialColors = singleproduct.product_colors?.map((color) => ({
        color_id: color.color.id,
        stock_quantity: color.stock_quantity,
        price: color.price,
        color_discounted_amount_each: color.color_discounted_amount_each,
        size: color.size,
        priority: color.priority,
        pre_book_eligible: color.pre_book_eligible,
        pre_book_quantity: color.pre_book_quantity,

        images: color.images.map((image) => ({
          uid: image.id,
          name: image.image.split("/").pop(),
          url: `${apiurl}${image.image}`,
          originFileObj: null,
        })),
      }));

      setColorFields(initialColors || []);
      setCategoryType(singleproduct?.category?.name);

      form.setFieldsValue({
        name: singleproduct.name,
        category_id: singleproduct?.category?.id || null,
        weight: singleproduct.weight || null,
        colors: initialColors,
        is_special_collection: singleproduct.is_special_collection || false,
        is_active: singleproduct.is_active || false,
        allow_zeropointfive: singleproduct.allow_zeropointfive || false,
        youtubelink: singleproduct.youtubeLink || null,
        length: singleproduct.length || null,
        breadth: singleproduct.breadth || null,
        height: singleproduct.height || null,
        description: singleproduct.description || "",
        product_type: singleproduct.type || "",
        offer_type: singleproduct.offer_type || "",
        dress_type: singleproduct.dress_type || "",
      });
    }
  }, [singleproduct, apiurl, form]);

  // console.log("offer type", singleproduct?.offer_type);

  // console.log("height", singleproduct);

  const fetchProductId = async ({ id, apiurl }) => {
    try {
      const response = await fetch(`${apiurl}/products/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      setSingleProduct(data);
    } catch (err) {
    } finally {
    }
  };

  const { havingcolors, colorsloading, colorserror } = useSelector(
    (state) => state.colors
  );
  const { categories, categoriesloading, categoriesserror } = useSelector(
    (state) => state.categories
  );

  if (!colorsloading) {
    // console.log("colors", havingcolors);
  } else {
    // console.log("colorserror", colorserror);
  }

  if (!categoriesloading) {
    // console.log("categories", categories);
  } else if (categoriesserror) {
    // console.log("colorserror", categoriesserror);
  }

  if (categoriesloading) {
    return <Loader />;
  }

  if (colorsloading) {
    return <Loader />;
  }

  const handleAddColor = () => {
    setColorFields([
      ...colorFields,
      {
        color_id: null,
        stock_quantity: 0,
        price: 0,
        color_discounted_amount_each: 0,
        size: 0,

        priority: 0,
        images: [],
        pre_book_eligible: false,
        pre_book_quantity: 0,
      },
    ]);
  };

  const handleRemoveColor = (index) => {
    const updatedColors = [...colorFields];
    updatedColors.splice(index, 1);
    setColorFields(updatedColors);
  };

  const handleImageChange = (e, index) => {
    const updatedColors = [...colorFields];
    updatedColors[index].images = e.fileList;
    setColorFields(updatedColors);
  };

  // console.log("singleproduct", singleproduct);

  const handleUpdateProduct = () => {
    setupdatingloading(true)
    form.validateFields().then(async (values) => {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("category_id", values.category_id);
      formData.append("weight", values.weight);
      formData.append("is_special_collection", values.is_special_collection);
      formData.append("is_active", values.is_active);
      formData.append("allow_zeropointfive", values.allow_zeropointfive);
      formData.append("description", values.description);
      formData.append("youtubelink", values.youtubelink);
      formData.append("length", values.length);
      formData.append("breadth", values.breadth);
      formData.append("height", values.height);
      formData.append("product_type", values.product_type);
      formData.append("offer_type", values.offer_type);
      formData.append("dress_type", values.dress_type);

      const colors = await Promise.all(
        colorFields.map(async (color) => {
          // Identify existing images (those that don't have a new file object)
          const existing_image_ids = color.images
            .filter((img) => !img.originFileObj && img.uid)
            .map((img) => img.uid);

          // Append only NEWLY uploaded files to FormData
          color.images.forEach((image) => {
            if (image.originFileObj) {
              const key = color.size
                ? `images_${color.color_id}_${color.size}`
                : `images_${color.color_id}_`;
              formData.append(key, image.originFileObj);
            }
          });

          return {
            color_id: color.color_id,
            stock_quantity: color.stock_quantity,
            price: color.price,
            color_discounted_amount_each: color.color_discounted_amount_each,
            size: color.size,
            priority: color.priority,
            pre_book_eligible: color.pre_book_eligible,
            pre_book_quantity: color.pre_book_quantity,
            existing_image_ids: existing_image_ids, // Send existing IDs to backend
          };
        })
      );

      formData.append("colors", JSON.stringify(colors));

      dispatch(updateProduct({ id, formData, access_token }))
        .unwrap()
        .then(() => {
          form.resetFields();
            setupdatingloading(false);
          // navigate("/inventory");
          // window.history.go(-2);
          navigate(`/inventory${location.search}`);

          message.success("Product updated successfully");
        })
        .catch((error) =>{
          console.error("Error updating product:", error)
            setupdatingloading(false);

        }
      );
    });
  };

  const productTypes = [
    { label: "Saree", value: "product" },
    { label: "Fabric", value: "fabric" },
    { label: "Dress", value: "dress" },
    { label: "Blouse", value: "blouse" },
  ];

  const offersTypes = [
    { label: "Last Pieces", value: "last_pieces" },
    { label: "Miss Prints", value: "miss_prints" },
    { label: "Weaving Mistakes", value: "weaving_mistakes" },
    { label: "Negligible Damages", value: "negligible_damages" },
  ];
  const dressesTypes = [
    { label: "Reference dresses", value: "reference_dresses" },
    { label: "New Arrival", value: "new_arrivals" },
  ];

  return (
    <Main>
      <div className="add-product-container">
        <Form form={form} layout="vertical" className="add-product-form">
          <div className="form-grid">
            <div className="form-left">
              <Form.Item
                name="name"
                label="Product Name"
                className="form-item"
                rules={[
                  { required: true, message: "Please input the product name!" },
                ]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>

              <Form.Item
                name="category_id"
                label="Category"
                className="form-item"
                rules={[
                  { required: true, message: "Please select the category!" },
                ]}
              >
                <Select
                  placeholder="Select a category"
                  loading={categoriesloading}
                  onChange={(id) => {
                    const selectedCategory = categories.find(
                      (category) => category.id === id
                    );
                    if (selectedCategory) {
                      setCategoryType(selectedCategory.name);
                    }
                  }}
                >
                  {categories?.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                  {categoriesserror && (
                    <Select.Option disabled value="error">
                      Failed to load categories
                    </Select.Option>
                  )}
                </Select>
              </Form.Item>
              <Form.Item
                name="product_type"
                label="Product Type"
                className="form-item"
                rules={[
                  {
                    required: true,
                    message: "Please select the Product Type!",
                  },
                ]}
              >
                <Select placeholder="Select a product type">
                  {productTypes.map((type) => (
                    <Select.Option key={type.value} value={type.value}>
                      {type.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {categoryType?.toLowerCase().match(/^offers$/) ? (
                <Form.Item
                  name="offer_type"
                  label="Offers Type"
                  className="form-item"
                >
                  <Select placeholder="Select a Offer type">
                    {offersTypes.map((type) => (
                      <Select.Option key={type.value} value={type.value}>
                        {type.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : (
                ""
              )}

              {categoryType?.toLowerCase().match(/^dresses$/) ? (
                <Form.Item
                  name="dress_type"
                  label="Dress Type"
                  className="form-item"
                >
                  <Select placeholder="Select a Dress type">
                    {dressesTypes.map((type) => (
                      <Select.Option key={type.value} value={type.value}>
                        {type.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : (
                ""
              )}

              <Form.Item
                name="weight"
                label="Weight(in grams)"
                className="form-item"
                rules={[
                  {
                    required: true,
                    message: "Please enter the weight of the product!",
                  },
                ]}
              >
                <InputNumber min={50} step={0.5} />
              </Form.Item>
              <Form.Item
                name="youtubelink"
                label="youtublink"
                className="form-item"
              >
                <Input placeholder="Enter youtube link" />
              </Form.Item>
              <div className="measerments">
                <Form.Item
                  name="length"
                  label="length (In cm)"
                  className="form-item"
                >
                  <InputNumber min={0} placeholder="Enter leangth " />
                </Form.Item>
                <Form.Item
                  name="breadth"
                  label="breadth (In cm)"
                  className="form-item"
                >
                  <InputNumber min={0} placeholder="Enter breadth " />
                </Form.Item>
                <Form.Item
                  name="height"
                  label="height  (In cm)"
                  className="form-item"
                >
                  <InputNumber min={0} placeholder="Enter height " />
                </Form.Item>
              </div>

              <Form.Item
                name="description"
                label="Description"
                className="form-item"
              >
                <TextArea rows={4} placeholder="Enter product description" />
              </Form.Item>

              <Form.Item
                name="is_special_collection"
                valuePropName="checked"
                className="form-item"
              >
                <Checkbox>Special Collection</Checkbox>
              </Form.Item>

              <Form.Item
                name="is_active"
                valuePropName="checked"
                className="form-item"
              >
                <Checkbox>Is Active</Checkbox>
              </Form.Item>
              <Form.Item
                name="allow_zeropointfive"
                valuePropName="checked"
                className="form-item"
              >
                <Checkbox>Allow 0.5</Checkbox>
              </Form.Item>

              <Button
                type="primary"
                onClick={handleUpdateProduct}
                loading={updatingloading}
                className="submit-button"
              >
                update Product
              </Button>
            </div>

            <div className="form-right">
              {colorFields.map((color, index) => (
                <div key={color.color_id || index} className="color-field">
                  <div className="add-prod-header">
                    <h4>Varient {index + 1}</h4>
                    <Button
                      danger
                      onClick={() => handleRemoveColor(index)}
                      className="remove-color-button"
                    >
                      <DeleteOutlined />
                    </Button>
                  </div>
                  <div className="color-field-space">
                    <Form.Item
                      label="Color"
                      className="form-item"
                      // name={["colors", index, "color_id"]}
                      placeholder="Select color"
                      rules={[
                        { required: true, message: "Please select a color!" },
                      ]}
                    >
                      <Select
                        placeholder="Select color"
                        value={color.color_id}
                        onChange={(value) => {
                          const newColorFields = [...colorFields];
                          newColorFields[index].color_id = value;
                          setColorFields(newColorFields);
                        }}
                        loading={colorsloading} // Show a spinner while loading colors
                        showSearch // Enables search functionality
                        optionFilterProp="children" // Filters options based on their text
                        filterOption={(input, option) =>
                          option?.children
                            ?.toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {havingcolors
                          ?.slice() // Create a shallow copy to avoid mutating the original array
                          .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
                          .map((colorOption) => (
                            <Select.Option
                              key={colorOption.id}
                              value={colorOption.id}
                            >
                              {colorOption.name}
                            </Select.Option>
                          ))}

                        {colorserror && (
                          <Select.Option disabled value="error">
                            Failed to load colors
                          </Select.Option>
                        )}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Stock Quantity"
                      className="form-item"
                      rules={[
                        { required: true, message: "Enter stock quantity" },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        value={color.stock_quantity}
                        onChange={(value) => {
                          const newColorFields = [...colorFields];
                          newColorFields[index].stock_quantity = value;
                          setColorFields(newColorFields);
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Price"
                      className="form-item"
                      rules={[{ required: true, message: "Enter price" }]}
                    >
                      <InputNumber
                        min={0}
                        step={50}
                        value={color.price}
                        onChange={(value) => {
                          const newColorFields = [...colorFields];
                          newColorFields[index].price = value;
                          setColorFields(newColorFields);
                        }}
                      />
                    </Form.Item>
                  </div>
                  <Form.Item label="Upload Images" className="form-item">
                    <Upload
                      listType="picture-card"
                      fileList={color.images}
                      onChange={(e) => handleImageChange(e, index)}
                      beforeUpload={() => false}
                    >
                      <UploadOutlined />
                      Upload
                    </Upload>
                  </Form.Item>

                  <Form.Item
                    label="discounted amount "
                    className="form-item"
                    rules={[{ required: true, message: "Enter price" }]}
                  >
                    <InputNumber
                      min={0}
                      step={50}
                      value={color.color_discounted_amount_each}
                      onChange={(value) => {
                        const newColorFields = [...colorFields];
                        newColorFields[index].color_discounted_amount_each =
                          value;
                        setColorFields(newColorFields);
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Priority"
                    className="form-item"
                    rules={[{ required: true, message: "Enter priority" }]}
                  >
                    <InputNumber
                      min={0}
                      step={1}
                      value={color.priority}
                      onChange={(value) => {
                        const newColorFields = [...colorFields];
                        newColorFields[index].priority = value;
                        setColorFields(newColorFields);
                      }}
                    />
                  </Form.Item>

                  {categoryType?.toLowerCase().match(/^dresses$/) ? (
                    <Form.Item
                      label="Sizes"
                      className="form-item"
                      rules={[{ required: true, message: "Enter size" }]}
                    >
                      <Input
                        value={color.size}
                        onChange={(e) => {
                          const newColorFields = [...colorFields];
                          newColorFields[index].size = e.target.value;
                          setColorFields(newColorFields);
                        }}
                      />
                    </Form.Item>
                  ) : (
                    ""
                  )}

                  <Form.Item label="Pre-book Eligible" className="form-item">
                    <Checkbox
                      checked={color.pre_book_eligible}
                      onChange={(e) => {
                        const updatedColors = [...colorFields];
                        updatedColors[index].pre_book_eligible =
                          e.target.checked;
                        setColorFields(updatedColors);
                      }}
                    >
                      Enable Pre-book
                    </Checkbox>
                  </Form.Item>
                  {color.pre_book_eligible && (
                    <Form.Item
                      label="Pre-book Quantity"
                      className="form-item"
                      rules={[
                        {
                          required: true,
                          message: "Please enter pre-book quantity!",
                          type: "number",
                          min: 1,
                        },
                      ]}
                    >
                      <InputNumber
                        value={color.pre_book_quantity}
                        min={0}
                        onChange={(value) => {
                          const updatedColors = [...colorFields];
                          updatedColors[index].pre_book_quantity = value;
                          setColorFields(updatedColors);
                        }}
                      />
                    </Form.Item>
                  )}
                </div>
              ))}
              <Button
                type="dashed"
                onClick={handleAddColor}
                className="add-color-button"
              >
                Add Varient
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </Main>
  );
};

export default UpdateProduct;
