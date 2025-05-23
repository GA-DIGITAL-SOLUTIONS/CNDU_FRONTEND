import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
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
    {
      color_id: "",
      stock_quantity: 0,
      price: 0,
      size: "",
      priority: 1,
      color_discounted_amount_each: 0,
      images: [],
      pre_book_eligible: false,
      pre_book_quantity: 0,
    },
  ]);

  const [categoryType, setCategoryType] = useState(null);
  const [isprebook, setIsPrebook] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { apiurl, access_token } = useSelector((state) => state.auth);

  const [form] = Form.useForm();
  const [colorform]=Form.useForm();

  const { havingcolors, colorsloading, colorserror } = useSelector(
    (state) => state.colors
  );
  const { categories, categoriesloading, categoriesserror } = useSelector(
    (state) => state.categories
  );
  const { addproductloading, addproducterror } = useSelector(
    (state) => state.products
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to handle the click event and open the modal
  const handleAddNewColor = () => {
    setIsModalVisible(true);
  };

  const handleExistingFormSubmit = async () => {
    try {
      // Validate the form fields
      const values = await colorform.validateFields();
      
      console.log('Existing form values:', values);
  
      // Prepare the data to be sent in the request
      const colorData = {
        name: values.colorName, // color name from form
        hexcode: values.hexCode, // hexcode from form
      };

  
      // Send the POST request to the server
      const response = await fetch(`${apiurl}/colors/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`, // Assuming token is stored in localStorage
        },
        body: JSON.stringify(colorData), // Sending the color data as JSON
      });
  
      const result = await response.json();
  
      if (response.status === 201) {
        console.log(result.message);
        message.success("successfully created the color ")
        // window.location.reload()
        dispatch(fetchColors({ apiurl }));
        form.resetFields();
        setIsModalVisible(false)
      } else if (response.status === 400) {
        console.log(result.error || 'An error occurred');
        message.error(result.error)

      } else if (response.status === 401) {
      } else {
      }
    } catch (errorInfo) {
      message.error(errorInfo)
      console.log('Validation Failed:', errorInfo);
      // setError('Form validation failed');
    }
  };
  

  // Function to close the modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };


  useEffect(() => {
    dispatch(fetchColors({ apiurl }));
    dispatch(fetchCategory({ apiurl }));
  }, [dispatch]);

 

  const initialValues = {
    name: "",
    category_id: null,
    weight: 50.0,
    price: 0,
    color_discounted_amount_each: 0,
    size: "",
    priority: 0,
    stock_quantity: 0,
    colors: [],
    is_special_collection: false,
    is_active: false,
    allow_zeropointfive: false,
    pre_book_eligible: false,
    product_type: "",
    offer_type: "",
    dress_type: "",
    length: "",
    breadth: "",
    pre_book_quantity: 0,
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
        // console.log("values", values);
        formData.append("name", values.name);
        formData.append("category_id", values.category_id);
        formData.append("weight", values.weight);
        formData.append("is_special_collection", values.is_special_collection);
        formData.append("is_active", values.is_active);

        formData.append("allow_zeropointfive", values.allow_zeropointfive);

        formData.append("youtubelink", values.youtubelink);
        formData.append("length", values.length);
        formData.append("breadth", values.breadth);
        formData.append("height", values.height);
        formData.append("product_type", values.product_type);
        formData.append("offer_type", values.offer_type);
        formData.append("dress_type", values.dress_type);

        if (values.panna === null || values.panna == undefined) {
          // console.log("panna remove here", values.panna); // don't add panna
          const Discription = `<strong>Fabric-Type :- </strong>${values.fabrictype}<br/> <strong>Wash:- </strong>${values.wash} <br/> <strong>work:- </strong> ${values.work} <br/> <strong>pattern:- </strong>${values.pattern}  <br/>`;
          formData.append("description", Discription);
        } else {
          // console.log("panna there ", values.panna); //  add panna
          const Discription = `<strong>Fabric-Type :- </strong>${values.fabrictype}<br/> <strong>Wash:- </strong>${values.wash} <br/><strong>Panna :- </strong>${values.panna}<br/> <strong>work:- </strong> ${values.work} <br/> <strong>pattern:- </strong>${values.pattern}  <br/>`;
          formData.append("description", Discription);
        }

        const colors = colorFields.map((color) => ({
          color_id: color.color_id,
          stock_quantity: color.stock_quantity,
          pre_book_eligible: color.pre_book_eligible,
          pre_book_quantity: color.pre_book_quantity,
          price: color.price,
          size: color.size,
          color_discounted_amount_each: color.color_discounted_amount_each,
          priority: color.priority,
        }));

        formData.append("colors", JSON.stringify(colors));

        colorFields.forEach((color) => {
          color.images.forEach((image) => {
            formData.append(`images_${color.color_id}_${color.size}`, image);
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
        // console.log("Validation Failed:", info);
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
    console.log("colorFields",colorFields.length)

    setColorFields([
      ...colorFields,
      {
        color_id: "",
        stock_quantity: 0,
        price: 0,
        size: "",
        color_discounted_amount_each: 0,
        priority: colorFields.length+1,
        // priority:0,
        images: [],
        pre_book_eligible: false,
        pre_book_quantity: 0,
      },
    ]);
  };

  console.log("colorFields",colorFields)

  const handleRemoveColor = (index) => {
    // console.log("Before clearing:", colorFields);

    const updatedColorFields = [...colorFields];
    updatedColorFields[index] = {};

    // console.log("After clearing:", updatedColorFields);

    const newColorFields = updatedColorFields.filter(
      (color) => Object.keys(color).length !== 0
    );

    // console.log("After deletion:", newColorFields);

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
     
     <Button type="primary" onClick={handleAddNewColor}>
        Add New Color
      </Button>
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
                  rules={[
                    {
                      required: true,
                      message: "please Enter length",
                    },
                  ]}
                >
                  <InputNumber min={0} placeholder="Enter length " />
                </Form.Item>
                <Form.Item
                  name="breadth"
                  label="breadth (In cm)"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      message: "please Enter breadth",
                    },
                  ]}
                >
                  <InputNumber min={0} placeholder="Enter breadth " />
                </Form.Item>
                <Form.Item
                  name="height"
                  label="height  (In cm)"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      message: "please Enter height",
                    },
                  ]}
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
              {!categoryType?.toLowerCase().match(/^dresses$/) && (
                <Form.Item name="panna" label="Panna" className="form-item">
                  <Input placeholder="Enter Panna " />
                </Form.Item>
              )}

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
                name="allow_zeropointfive"
                valuePropName="checked"
                className="form-item"
              >
                <Checkbox>Allow 0.5</Checkbox>
              </Form.Item>

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
                      // name="color_id"
                      className="form-item"
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
                      // name="stock_quantity"
                      rules={[
                        { required: true, message: "Enter stock quantity" },
                        {
                          validator: (_, value) =>
                            value === 0
                              ? Promise.reject(
                                  new Error("Stock quantity cannot be 0")
                                )
                              : Promise.resolve(),
                        },
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
                      // name="price"
                      rules={[
                        { required: true, message: "Enter price" },
                        {
                          validator: (_, value) =>
                            value === 0
                              ? Promise.reject(new Error("price cannot be 0"))
                              : Promise.resolve(),
                        },
                      ]}
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
                  <Form.Item label="Discount price" className="form-item">
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
                    label="Color Priority"
                    className="form-item"
                    rules={[{ required: true, message: "Enter price" }]}
                  >
                    <InputNumber
                      min={1}
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
                      rules={[{ required: false, message: "Enter size" }]}
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
                  <Form.Item
                    name={`pre_book_eligible_${index}`}
                    valuePropName="checked"
                    className="form-item"
                  >
                    <Checkbox
                      onChange={(e) => {
                        const updatedColorFields = [...colorFields];
                        updatedColorFields[index].pre_book_eligible =
                          e.target.checked;
                        setColorFields(updatedColorFields);
                      }}
                    >
                      Pre Booking
                    </Checkbox>
                  </Form.Item>

                  {colorFields[index]?.pre_book_eligible && (
                    <Form.Item
                      name={`pre_book_quantity_${index}`}
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
                        max={10000}
                        onChange={(e) => {
                          const updatedColorFields = [...colorFields];
                          updatedColorFields[index].pre_book_quantity =
                            e.target.value;
                          setColorFields(updatedColorFields);
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

      <Modal
        title="Add New Color"
        visible={isModalVisible}
        onOk={handleExistingFormSubmit}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={colorform} layout="vertical">
          <Form.Item
            label="Color Name"
            name="colorName"
            rules={[{ required: true, message: 'Please enter a color name' }]}
          >
            <Input placeholder="e.g. red, blue, green" />
          </Form.Item>

          <Form.Item
            label="Hex Code"
            name="hexCode"
            rules={[
              { required: true, message: 'Please enter the hex code' },
              { pattern: /^#[0-9A-Fa-f]{6}$/, message: 'Invalid hex code' },
            ]}
          >
            <Input placeholder="#FF5733" />
          </Form.Item>
        </Form>
      </Modal>
    </Main>
  );
};

export default Addproduct;



// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   Checkbox,
//   Form,
//   Input,
//   InputNumber,
//   message,
//   Select,
//   Spin,
//   Upload,
// } from "antd";
// import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
// import Main from "./AdminLayout/AdminLayout";
// import "./Addproduct.css";
// import { useDispatch, useSelector } from "react-redux";
// import { addProduct } from "../../store/productsSlice";
// import { useNavigate } from "react-router-dom";
// import { fetchColors } from "../../store/colorsSlice";
// import { fetchCategory } from "../../store/catogerySlice";
// const { TextArea } = Input;

// const Addproduct = () => {
//   const [colorFields, setColorFields] = useState([
//     {
//       color_id: "",
//       stock_quantity: 0,
//       price: 0,
//       size: "",
//       priority: 0,
//       color_discounted_amount_each: 0,
//       images: [],
//       pre_book_eligible: false,
//       pre_book_quantity: 0,
//     },
//   ]);
//   const [categoryType, setCategoryType] = useState(null);
//   const [isprebook, setIsPrebook] = useState(false);
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);
//   const { apiurl, access_token } = useSelector((state) => state.auth);

//   const [form] = Form.useForm();

//   const { havingcolors, colorsloading, colorserror } = useSelector(
//     (state) => state.colors
//   );
//   const { categories, categoriesloading, categoriesserror } = useSelector(
//     (state) => state.categories
//   );
//   const { addproductloading, addproducterror } = useSelector(
//     (state) => state.products
//   );

//   if (!colorsloading) {
//     // console.log("colors", havingcolors);
//   } else {
//     // console.log("colorserror", colorserror);
//   }

//   useEffect(() => {
//     dispatch(fetchColors({ apiurl }));
//     dispatch(fetchCategory({ apiurl }));
//   }, [dispatch]);

//   if (!categoriesloading) {
//     // console.log("categories", categories);
//   } else if (categoriesserror) {
//     // console.log("colorserror", categoriesserror);
//   } else {
//   }

//   const initialValues = {
//     name: "",
//     category_id: null,
//     weight: 50.0,
//     price: 0,
//     color_discounted_amount_each: 0,
//     size: "",
//     priority: 0,
//     stock_quantity: 0,
//     colors: [],
//     is_special_collection: false,
//     is_active: false,
//     allow_zeropointfive: false,
//     pre_book_eligible: false,
//     product_type: "",
//     offer_type: "",
//     dress_type: "",
//     length: "",
//     breadth: "",
//     pre_book_quantity: 0,
//     height: "",
//     youtubelink: "",
//     Discription: "",
//   };

//   const handleAddProduct = () => {
//     setLoading(true);
//     form
//       .validateFields()
//       .then((values) => {
//         const formData = new FormData();
//         // console.log("values", values);
//         formData.append("name", values.name);
//         formData.append("category_id", values.category_id);
//         formData.append("weight", values.weight);
//         formData.append("is_special_collection", values.is_special_collection);
//         formData.append("is_active", values.is_active);

//         formData.append("allow_zeropointfive", values.allow_zeropointfive);

//         formData.append("youtubelink", values.youtubelink);
//         formData.append("length", values.length);
//         formData.append("breadth", values.breadth);
//         formData.append("height", values.height);
//         formData.append("product_type", values.product_type);
//         formData.append("offer_type", values.offer_type);
//         formData.append("dress_type", values.dress_type);

//         if (values.panna === null || values.panna == undefined) {
//           // console.log("panna remove here", values.panna); // don't add panna
//           const Discription = `<strong>Fabric-Type :- </strong>${values.fabrictype}<br/> <strong>Wash:- </strong>${values.wash} <br/> <strong>work:- </strong> ${values.work} <br/> <strong>pattern:- </strong>${values.pattern}  <br/>`;
//           formData.append("description", Discription);
//         } else {
//           // console.log("panna there ", values.panna); //  add panna
//           const Discription = `<strong>Fabric-Type :- </strong>${values.fabrictype}<br/> <strong>Wash:- </strong>${values.wash} <br/><strong>Panna :- </strong>${values.panna}<br/> <strong>work:- </strong> ${values.work} <br/> <strong>pattern:- </strong>${values.pattern}  <br/>`;
//           formData.append("description", Discription);
//         }

//         const colors = colorFields.map((color) => ({
//           color_id: color.color_id,
//           stock_quantity: color.stock_quantity,
//           pre_book_eligible: color.pre_book_eligible,
//           pre_book_quantity: color.pre_book_quantity,
//           price: color.price,
//           size: color.size,
//           color_discounted_amount_each: color.color_discounted_amount_each,
//           priority: color.priority,
//         }));

//         formData.append("colors", JSON.stringify(colors));

//         colorFields.forEach((color) => {
//           color.images.forEach((image) => {
//             formData.append(`images_${color.color_id}_${color.size}`, image);
//           });
//         });

//         dispatch(addProduct({ formData, access_token }))
//           .unwrap()
//           .then(() => {
//             form.resetFields();
//             setColorFields([]);
//             message.success("successfully product added ");
//           })
//           .catch((error) => {
//             console.error("Error adding product:", error);
//           });
//       })
//       .catch((info) => {
//         // console.log("Validation Failed:", info);
//       });
//     setLoading(false);
//   };

//   const handlePreBookingChange = (e) => {
//     setIsPrebook(e.target.checked);
//   };

//   const handleImageChange = (e, index) => {
//     const newColorFields = [...colorFields];
//     newColorFields[index].images = e.fileList.map(
//       (file) => file.originFileObj || file
//     );
//     setColorFields(newColorFields);
//   };

//   const handleAddColor = () => {
//     setColorFields([
//       ...colorFields,
//       {
//         color_id: "",
//         stock_quantity: 0,
//         price: 0,
//         size: "",
//         color_discounted_amount_each: 0,
//         priority: 0,
//         images: [],
//         pre_book_eligible: false,
//         pre_book_quantity: 0,
//       },
//     ]);
//   };

//   const handleRemoveColor = (index) => {
//     // console.log("Before clearing:", colorFields);

//     const updatedColorFields = [...colorFields];
//     updatedColorFields[index] = {};

//     // console.log("After clearing:", updatedColorFields);

//     const newColorFields = updatedColorFields.filter(
//       (color) => Object.keys(color).length !== 0
//     );

//     // console.log("After deletion:", newColorFields);

//     setColorFields(newColorFields);
//   };

//   const productTypes = [
//     { label: "Saree", value: "product" },
//     { label: "Fabric", value: "fabric" },
//     { label: "Dress", value: "dress" },
//     { label: "Blouse", value: "blouse" },
//   ];
//   const offersTypes = [
//     { label: "Last Pieces", value: "last_pieces" },
//     { label: "Miss Prints", value: "miss_prints" },
//     { label: "Weaving Mistakes", value: "weaving_mistakes" },
//     { label: "Negligible Damages", value: "negligible_damages" },
//   ];
//   const dressesTypes = [
//     { label: "Reference dresses", value: "reference_dresses" },
//     { label: "New Arrival", value: "new_arrivals" },
//   ];
//   return (
//     <Main>
//       <div className="add-product-container">
//         <Form
//           form={form}
//           layout="vertical"
//           initialValues={initialValues}
//           className="add-product-form"
//         >
//           <div className="form-grid">
//             <div className="form-left">
//               <Form.Item
//                 name="name"
//                 label="Product Name"
//                 className="form-item"
//                 rules={[
//                   { required: true, message: "Please input the product name!" },
//                 ]}
//               >
//                 <Input placeholder="Enter product name" />
//               </Form.Item>

//               <Form.Item
//                 name="category_id"
//                 label="Category"
//                 className="form-item"
//                 rules={[
//                   { required: true, message: "Please select the category!" },
//                 ]}
//               >
//                 <Select
//                   placeholder="Select a category"
//                   loading={categoriesloading}
//                   onChange={(id) => {
//                     const selectedCategory = categories.find(
//                       (category) => category.id === id
//                     );
//                     if (selectedCategory) {
//                       setCategoryType(selectedCategory.name);
//                     }
//                   }}
//                 >
//                   {categories?.map((category) => (
//                     <Select.Option key={category.id} value={category.id}>
//                       {category.name}
//                     </Select.Option>
//                   ))}
//                   {categoriesserror && (
//                     <Select.Option disabled value="error">
//                       Failed to load categories
//                     </Select.Option>
//                   )}
//                 </Select>
//               </Form.Item>

//               <Form.Item
//                 name="product_type"
//                 label="Product Type"
//                 className="form-item"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please select the Product Type!",
//                   },
//                 ]}
//               >
//                 <Select placeholder="Select a product type">
//                   {productTypes.map((type) => (
//                     <Select.Option key={type.value} value={type.value}>
//                       {type.label}
//                     </Select.Option>
//                   ))}
//                 </Select>
//               </Form.Item>

//               {categoryType?.toLowerCase().match(/^offers$/) ? (
//                 <Form.Item
//                   name="offer_type"
//                   label="Offers Type"
//                   className="form-item"
//                 >
//                   <Select placeholder="Select a Offer type">
//                     {offersTypes.map((type) => (
//                       <Select.Option key={type.value} value={type.value}>
//                         {type.label}
//                       </Select.Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               ) : (
//                 ""
//               )}

//               {categoryType?.toLowerCase().match(/^dresses$/) ? (
//                 <Form.Item
//                   name="dress_type"
//                   label="Dress Type"
//                   className="form-item"
//                 >
//                   <Select placeholder="Select a Dress type">
//                     {dressesTypes.map((type) => (
//                       <Select.Option key={type.value} value={type.value}>
//                         {type.label}
//                       </Select.Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               ) : (
//                 ""
//               )}

//               <Form.Item
//                 name="weight"
//                 label="Weight(in grams)"
//                 className="form-item"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter the weight of the product!",
//                   },
//                 ]}
//               >
//                 <InputNumber min={50} step={0.5} />
//               </Form.Item>

//               <Form.Item
//                 name="youtubelink"
//                 label="youtublink"
//                 className="form-item"
//               >
//                 <Input placeholder="Enter youtube link" />
//               </Form.Item>
//               <div className="measerments">
//                 <Form.Item
//                   name="length"
//                   label="length (In cm)"
//                   className="form-item"
//                   rules={[
//                     {
//                       required: true,
//                       message: "please Enter length",
//                     },
//                   ]}
//                 >
//                   <InputNumber min={0} placeholder="Enter length " />
//                 </Form.Item>
//                 <Form.Item
//                   name="breadth"
//                   label="breadth (In cm)"
//                   className="form-item"
//                   rules={[
//                     {
//                       required: true,
//                       message: "please Enter breadth",
//                     },
//                   ]}
//                 >
//                   <InputNumber min={0} placeholder="Enter breadth " />
//                 </Form.Item>
//                 <Form.Item
//                   name="height"
//                   label="height  (In cm)"
//                   className="form-item"
//                   rules={[
//                     {
//                       required: true,
//                       message: "please Enter height",
//                     },
//                   ]}
//                 >
//                   <InputNumber min={0} placeholder="Enter height " />
//                 </Form.Item>
//               </div>

//               <h1>Description</h1>
//               <Form.Item
//                 name="fabrictype"
//                 label="Fabric Type"
//                 className="form-item"
//               >
//                 <Input placeholder="Enter Fabric Type " />
//               </Form.Item>
//               <Form.Item name="work" label="Work" className="form-item">
//                 <Input placeholder="Enter Work " />
//               </Form.Item>
//               <Form.Item name="pattern" label="Pattern" className="form-item">
//                 <Input placeholder="Enter pattern " />
//               </Form.Item>
//               {!categoryType?.toLowerCase().match(/^dresses$/) && (
//                 <Form.Item name="panna" label="Panna" className="form-item">
//                   <Input placeholder="Enter Panna " />
//                 </Form.Item>
//               )}

//               <Form.Item name="wash" label="Wash" className="form-item">
//                 <Input placeholder="Enter Wash " />
//               </Form.Item>

//               <Form.Item
//                 name="is_special_collection"
//                 valuePropName="checked"
//                 className="form-item"
//               >
//                 <Checkbox>Special Collection</Checkbox>
//               </Form.Item>
//               <Form.Item
//                 name="is_active"
//                 valuePropName="checked"
//                 className="form-item"
//               >
//                 <Checkbox>Is Active</Checkbox>
//               </Form.Item>

//               <Form.Item
//                 name="allow_zeropointfive"
//                 valuePropName="checked"
//                 className="form-item"
//               >
//                 <Checkbox>Allow 0.5</Checkbox>
//               </Form.Item>

//               <Button
//                 type="primary"
//                 onClick={handleAddProduct}
//                 className="submit-button"
//                 loading={addproductloading}
//               >
//                 Add Product
//               </Button>
//             </div>

//             <div className="form-right">
//               {colorFields.map((color, index) => (
//                 <div key={color.color_id || index} className="color-field">
//                   <div className="add-prod-header">
//                     <h4>Varient {index + 1}</h4>
//                     <Button
//                       danger
//                       onClick={() => handleRemoveColor(index)}
//                       className="remove-color-button"
//                     >
//                       <DeleteOutlined />
//                     </Button>
//                   </div>
//                   <div className="color-field-space">
//                     <Form.Item
//                       label="Color"
//                       name="color_id"
//                       className="form-item"
//                       rules={[
//                         { required: true, message: "Please select a color!" },
//                       ]}
//                     >
//                       <Select
//                         placeholder="Select color"
//                         value={color.color_id}
//                         onChange={(value) => {
//                           const newColorFields = [...colorFields];
//                           newColorFields[index].color_id = value;
//                           setColorFields(newColorFields);
//                         }}
//                         loading={colorsloading} // Show a spinner while loading colors
//                         showSearch // Enables search functionality
//                         optionFilterProp="children" // Filters options based on their text
//                         filterOption={(input, option) =>
//                           option?.children
//                             ?.toLowerCase()
//                             .includes(input.toLowerCase())
//                         }
//                       >
//                         {havingcolors
//                           ?.slice() // Create a shallow copy to avoid mutating the original array
//                           .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
//                           .map((colorOption) => (
//                             <Select.Option
//                               key={colorOption.id}
//                               value={colorOption.id}
//                             >
//                               {colorOption.name}
//                             </Select.Option>
//                           ))}

//                         {colorserror && (
//                           <Select.Option disabled value="error">
//                             Failed to load colors
//                           </Select.Option>
//                         )}
//                       </Select>
//                     </Form.Item>

//                     <Form.Item
//                       label="Stock Quantity"
//                       className="form-item"
//                       name="stock_quantity"
//                       rules={[
//                         { required: true, message: "Enter stock quantity" },
//                         {
//                           validator: (_, value) =>
//                             value === 0
//                               ? Promise.reject(
//                                   new Error("Stock quantity cannot be 0")
//                                 )
//                               : Promise.resolve(),
//                         },
//                       ]}
//                     >
//                       <InputNumber
//                         min={0}
//                         value={color.stock_quantity}
//                         onChange={(value) => {
//                           const newColorFields = [...colorFields];
//                           newColorFields[index].stock_quantity = value;
//                           setColorFields(newColorFields);
//                         }}
//                       />
//                     </Form.Item>

//                     <Form.Item
//                       label="Price"
//                       className="form-item"
//                       name="price"
//                       rules={[
//                         { required: true, message: "Enter price" },
//                         {
//                           validator: (_, value) =>
//                             value === 0
//                               ? Promise.reject(new Error("price cannot be 0"))
//                               : Promise.resolve(),
//                         },
//                       ]}
//                     >
//                       <InputNumber
//                         min={0}
//                         step={50}
//                         value={color.price}
//                         onChange={(value) => {
//                           const newColorFields = [...colorFields];
//                           newColorFields[index].price = value;
//                           setColorFields(newColorFields);
//                         }}
//                       />
//                     </Form.Item>
//                   </div>
//                   <Form.Item label="Upload Images" className="form-item">
//                     <Upload
//                       listType="picture-card"
//                       fileList={color.images}
//                       onChange={(e) => handleImageChange(e, index)}
//                       beforeUpload={() => false}
//                     >
//                       <UploadOutlined />
//                       Upload
//                     </Upload>
//                   </Form.Item>
//                   <Form.Item label="Discount price" className="form-item">
//                     <InputNumber
//                       min={0}
//                       step={50}
//                       value={color.color_discounted_amount_each}
//                       onChange={(value) => {
//                         const newColorFields = [...colorFields];
//                         newColorFields[index].color_discounted_amount_each =
//                           value;
//                         setColorFields(newColorFields);
//                       }}
//                     />
//                   </Form.Item>
//                   <Form.Item
//                     label="Color Priority"
//                     className="form-item"
//                     rules={[{ required: true, message: "Enter price" }]}
//                   >
//                     <InputNumber
//                       min={0}
//                       step={1}
//                       value={color.priority}
//                       onChange={(value) => {
//                         const newColorFields = [...colorFields];
//                         newColorFields[index].priority = value;
//                         setColorFields(newColorFields);
//                       }}
//                     />
//                   </Form.Item>

//                   {categoryType?.toLowerCase().match(/^dresses$/) ? (
//                     <Form.Item
//                       label="Sizes"
//                       className="form-item"
//                       rules={[{ required: false, message: "Enter size" }]}
//                     >
//                       <Input
//                         value={color.size}
//                         onChange={(e) => {
//                           const newColorFields = [...colorFields];
//                           newColorFields[index].size = e.target.value;
//                           setColorFields(newColorFields);
//                         }}
//                       />
//                     </Form.Item>
//                   ) : (
//                     ""
//                   )}
//                   <Form.Item
//                     name={`pre_book_eligible_${index}`}
//                     valuePropName="checked"
//                     className="form-item"
//                   >
//                     <Checkbox
//                       onChange={(e) => {
//                         const updatedColorFields = [...colorFields];
//                         updatedColorFields[index].pre_book_eligible =
//                           e.target.checked;
//                         setColorFields(updatedColorFields);
//                       }}
//                     >
//                       Pre Booking
//                     </Checkbox>
//                   </Form.Item>

//                   {colorFields[index]?.pre_book_eligible && (
//                     <Form.Item
//                       name={`pre_book_quantity_${index}`}
//                       label="Pre-Book Quantity"
//                       rules={[
//                         {
//                           required: true,
//                           message: "Please enter the pre-book quantity!",
//                         },
//                       ]}
//                     >
//                       <Input
//                         type="number"
//                         placeholder="Enter pre-book quantity"
//                         min={1}
//                         max={10000}
//                         onChange={(e) => {
//                           const updatedColorFields = [...colorFields];
//                           updatedColorFields[index].pre_book_quantity =
//                             e.target.value;
//                           setColorFields(updatedColorFields);
//                         }}
//                       />
//                     </Form.Item>
//                   )}
//                 </div>
//               ))}

//               <Button
//                 type="dashed"
//                 onClick={handleAddColor}
//                 className="add-color-button"
//               >
//                 Add Varient
//               </Button>
//             </div>
//           </div>
//         </Form>
//       </div>
//     </Main>
//   );
// };

// export default Addproduct;