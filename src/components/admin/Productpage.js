import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card } from 'antd'; // Importing Ant Design Button and Card components
import { deleteProduct, fetchProducts } from '../../store/productsSlice';

const ProductPage = () => {
  const Navigate = useNavigate();
  const { access_token,apiurl } = useSelector((state) => state.auth);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const numericId = Number(id);

  // Debugging the products and numericId
  console.log(products);
  console.log(numericId);

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>Error: {error}</p>;

  // Find the product based on the id
  const product = products.find((product) => product.id === numericId);

  if (!product) return <p>Product not found.</p>;

  // Navigate to the edit page
  const handleEdit = () => {
    Navigate(`/inventory/product/edit/${id}`, { state: { product } });
  };

  // Handle product deletion
  const handleDelete = () => {
    console.log('Delete product:', product);
    dispatch(deleteProduct({ id, access_token }))
      .unwrap()
      .then(() => {
        console.log('Product deleted successfully');
        dispatch(fetchProducts());
        Navigate('/inventory');
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card
        hoverable
        style={{ width: '75%', maxWidth: '600px', margin: 'auto' }}
        cover={<img alt={product.name}  src={`${apiurl}${product.image}`} />}
      >
        <Card.Meta
          title={product.name}
          description={`Price: $${product.price}`}
        />
        <p>{product.description}</p>
        <div style={{ marginTop: '10px' }}>
          <Button type="primary" onClick={handleEdit} style={{ marginRight: '10px' }}>
            Edit
          </Button>
          <Button type="danger" danger onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProductPage;
