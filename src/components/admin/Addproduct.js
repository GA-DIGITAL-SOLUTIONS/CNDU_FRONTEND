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
  const [categoryType, setCategoryType] = useState(null);
  const [isprebook, setIsPrebook] = useState(false);
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
  const { addproductloading, addproducterror } = useSelector(
    (state) => state.products
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
  } else {
  }

  const initialValues = {
    name: "",
    category_id: null,
    weight: 50.0,
    price: 0,
    stock_quantity: 0,
    colors: [],
    is_special_collection: false,
    is_active: false,
    pre_book_eligible: false,
    product_type: "",
    offer_type: "",
    dress_type: "",
    length: "",
    breadth: "",
    pre_book_quantity:0,
    height: "",
    youtubelink: "",
    Discription: "",
  };

  const handleAddProduct = () => {
    setLoading(true);
    form
      .validateFields()
      .then((values) => {
        const formData = new FormData();
        console.log("values", values);
        formData.append("name", values.name);
        formData.append("category_id", values.category_id);
        formData.append("weight", values.weight);
        formData.append("is_special_collection", values.is_special_collection);
        formData.append("pre_book_eligible", values.pre_book_eligible);
        formData.append("is_pre", values.is_active);
        formData.append("pre_book_quantity", values.pre_book_quantity);


        formData.append("youtubelink", values.youtubelink);
        formData.append("length", values.length);
        formData.append("breadth", values.breadth);
        formData.append("height", values.height);
        formData.append("product_type", values.product_type);
        formData.append("offer_type", values.offer_type);
        formData.append("dress_type", values.dress_type);

        const Discription = `<strong>Fabric-Type :- </strong>${values.fabrictype}<br/> <strong>Wash:- </strong>${values.wash} <br/><strong>Panna :- </strong>${values.panna}<br/> <strong>work:- </strong> ${values.work} <br/> <strong>pattern:- </strong>${values.pattern}  <br/>`;
        formData.append("description", Discription);

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
            setColorFields([]);
            message.success("successfully product added ");
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

  const handlePreBookingChange = (e) => {
    setIsPrebook(e.target.checked);
  };
  const handleImageChange = (e, index) => {
    const newColorFields = [...colorFields];
    newColorFields[index].images = e.fileList.map(
      (file) => file.originFileObj || file
    );
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

    const updatedColorFields = [...colorFields];
    updatedColorFields[index] = {};

    console.log("After clearing:", updatedColorFields);

    const newColorFields = updatedColorFields.filter(
      (color) => Object.keys(color).length !== 0
    );

    console.log("After deletion:", newColorFields);

    setColorFields(newColorFields);
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

              <h1>Description</h1>
              <Form.Item
                name="fabrictype"
                label="Fabric Type"
                className="form-item"
              >
                <Input placeholder="Enter Fabric Type " />
              </Form.Item>
              <Form.Item name="work" label="Work" className="form-item">
                <Input placeholder="Enter Work " />
              </Form.Item>
              <Form.Item name="pattern" label="Pattern" className="form-item">
                <Input placeholder="Enter pattern " />
              </Form.Item>

              <Form.Item name="panna" label="Panna" className="form-item">
                <Input placeholder="Enter Panna " />
              </Form.Item>
              <Form.Item name="wash" label="Wash" className="form-item">
                <Input placeholder="Enter Wash " />
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
                name="pre_book_eligible"
                valuePropName="checked"
                className="form-item"
              >
                <Checkbox onChange={handlePreBookingChange}>
                  Pre Booking
                </Checkbox>
              </Form.Item>
              {isprebook && (
                <Form.Item
                  name="pre_book_quantity"
                  label="Pre-Book Quantity"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the pre-book quantity!",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    placeholder="Enter pre-book quantity"
                    min={1}
                    max={1000}
                  />
                </Form.Item>
              )}

              <Button
                type="primary"
                onClick={handleAddProduct}
                className="submit-button"
                loading={addproductloading}
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
                      fileList={color.images}
                      onChange={(e) => handleImageChange(e, index)}
                      beforeUpload={() => false}
                    >
                      <UploadOutlined />
                      Upload
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
