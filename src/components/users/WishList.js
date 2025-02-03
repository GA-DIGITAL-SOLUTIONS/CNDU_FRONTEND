import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlistItems, } from "../../store/wishListSlice";
import { fetchProducts } from "../../store/productsSlice";
import WishListItem from "./WishListItem";
import { removeWishlistItem } from "../../store/wishListSlice";

const WishList = () => {
  const dispatch = useDispatch();
  const { apiurl, access_token } = useSelector((state) => state.auth);
  const { items, loading: wishlistLoading, error } = useSelector((state) => state.wishlist);
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    if (apiurl && access_token) {
      dispatch(fetchWishlistItems({ apiurl, access_token }));
      dispatch(fetchProducts());
    }
  }, [dispatch, apiurl, access_token]);

  if (wishlistLoading || loading) return <div>Loading wishlist items...</div>;
  if (error) return <div>Error: {error}</div>;

  // Create a Set of wishlist item IDs for quick lookup
  const itemIdsInWishlist = new Set(items.map(item => item.object_id));

  // Filter products to get only those that are in the wishlist
  const wishlistProducts = products.filter(product => itemIdsInWishlist.has(product.id));

  const handleRemoveFromWishlist = (productId) => {

    const deleteItem = items.find((item) => item.object_id === productId);

    if (deleteItem) {
      // console.log("Item found:", deleteItem);

      const itemId={
        item_id:deleteItem.id
      }
       
    dispatch(removeWishlistItem({ apiurl, access_token, itemId }));
    dispatch(fetchWishlistItems({apiurl,access_token}))
// call the wishlist here if it is success 

    } else {
      // console.log("Item not found with productId:", productId);
    }
   
  };

  return (
    <div>
      <h1>Wishlist</h1>
      {wishlistProducts.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {wishlistProducts.map(product => (
            <WishListItem 
              key={product.id} 
              item={product}
              onRemove={handleRemoveFromWishlist} // Pass the remove function
            />
          ))}
        </div>
      ) : (
        <div>Your wishlist is empty.</div>
      )}
    </div>
  );
};

export default WishList;
