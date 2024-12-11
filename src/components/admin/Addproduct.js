import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Spin,
  Upload,
} from "antd";
import Loader from "../Loader/Loader";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import Main from "./AdminLayout/AdminLayout";
import "./Addproduct.css";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../store/productsSlice";
import { useNavigate } from "react-router-dom";
import { fetchColors } from "../../store/colorsSlice";
import { fetchCategory } from "../../store/catogerySlice";
const { TextArea } = Input;

const Addproduct = () => {
  const [colorFields, setColorFields] = useState([
    { color_id: "", stock_quantity: 0, price: 0, images: [] },
  ]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { apiurl, access_token } = useSelector((state) => state.auth);

  const [form] = Form.useForm();

  const { havingcolors, colorsloading, colorserror } = useSelector(
    (state) => state.colors
  );
  const { categories, categoriesloading, categoriesserror } = useSelector(
    (state) => state.categories
  );

  if (!colorsloading) {
    console.log("colors", havingcolors);
  } else {
    console.log("colorserror", colorserror);
  }

  useEffect(() => {
    dispatch(fetchColors({ apiurl }));
    dispatch(fetchCategory({ apiurl }));
  }, [dispatch]);

  if (!categoriesloading) {
    console.log("categories", categories);
  } else if (categoriesserror) {
    console.log("colorserror", categoriesserror);
  }

  if (categoriesloading) {
    return <Loader />;
  }

  if (colorsloading) {
    return <Loader />;
  }

  const initialValues = {
    name: "",
    category_id: null,
    weight: 50.0,
    price: 0,
    stock_quantity: 0,
    colors: [],
    is_special_collection: false,
    description: "",
    product_type: "",
  };

  const handleAddProduct = () => {
    setLoading(true);
    form
      .validateFields()
      .then((values) => {
        const formData = new FormData();

        formData.append("name", values.name);
        formData.append("category_id", values.category_id);
        formData.append("weight", values.weight);
        formData.append("description", values.description);
        formData.append("is_special_collection", values.is_special_collection);

        console.log("categories", categories);

        categories.forEach((obj) => {
          if (obj.id == values.category_id) {
            const productType =
              obj.name.toLowerCase() === "fabric" ? "fabric" : "product";
            formData.append("product_type", productType);
          }
        });

        const colors = colorFields.map((color) => ({
          color_id: color.color_id,
          stock_quantity: color.stock_quantity,
          price: color.price,
        }));
        formData.append("colors", JSON.stringify(colors));

        colorFields.forEach((color) => {
          color.images.forEach((image) => {
            formData.append(`images_${color.color_id}`, image);
          });
        });

        dispatch(addProduct({ formData, access_token }))
          .unwrap()
          .then(() => {
            form.resetFields();
            message.success("successfully product added ");
            // navigate("/inventory");
          })
          .catch((error) => {
            console.error("Error adding product:", error);
          });
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });

    setLoading(false);
  };

  // const handleImageChange = (e, index) => {
  //   const newColorFields = [...colorFields];
  //   newColorFields[index].images = e.fileList.map(
  //     (file) => file.originFileObj || file
  //   );
  //   setColorFields(newColorFields);
  // };

  const handleImageChange = (e, index) => {
    const newColorFields = [...colorFields];
    newColorFields[index].images = e.fileList; // Directly assign e.fileList to images
    setColorFields(newColorFields);
  };

  const handleAddColor = () => {
    setColorFields([
      ...colorFields,
      { color_id: "", stock_quantity: 0, price: 0, images: [] },
    ]);
  };

  const handleRemoveColor = (index) => {
    console.log("Before clearing:", colorFields);

    // Step 1: Empty the object at the specific index first
    const updatedColorFields = [...colorFields];
    updatedColorFields[index] = {}; // Clear the object at the index

    console.log("After clearing:", updatedColorFields);

    // Step 2: Remove the empty object from the array
    const newColorFields = updatedColorFields.filter(
      (color) => Object.keys(color).length !== 0
    ); // Remove empty objects

    console.log("After deletion:", newColorFields);

    // Update the state with the new list
    setColorFields(newColorFields);
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <Main>
      <div className="add-product-container">
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          className="add-product-form"
        >
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
                  loading={categoriesloading} // Show loading spinner if categories are being fetched
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

              <Button
                type="primary"
                onClick={handleAddProduct}
                className="submit-button"
              >
                Add Product
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
                      >
                        {havingcolors?.map((colorOption) => (
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
                        step={0.01}
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
                      fileList={color.images} // This is correctly set to the state that holds the images
                      onChange={(e) => handleImageChange(e, index)}
                      beforeUpload={() => false} // Prevent automatic upload, handle manually
                    >
                      <UploadOutlined /> Upload
                    </Upload>
                  </Form.Item>
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

export default Addproduct;
