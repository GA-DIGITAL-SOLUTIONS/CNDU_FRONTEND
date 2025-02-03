import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOutfits } from "../../store/OutfitSlice";
import { useNavigate } from "react-router-dom";
import { Button, Carousel, Modal } from "antd";
import { deleteOutfit } from "../../store/OutfitSlice";

const Outfits = () => {
  const { apiurl } = useSelector((state) => state.auth);
  const { outfits } = useSelector((state) => state.outfits);
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  useEffect(() => {
    if (apiurl) {
      dispatch(fetchOutfits({ apiurl }));
    }
  }, [dispatch, apiurl]);

  if (!outfits || outfits.length === 0) {
    return <div>No outfits available</div>;
  }

  const handleRemove = (id) => {
    // console.log("Remove this outfit with ID  :", id);
    
    dispatch(deleteOutfit({apiurl,id}))
  };

  const showConfirm = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this outfit?",
      content: "Once deleted, this action cannot be undone.",
      onOk() {
        handleRemove(id); 
      },
      onCancel() {
        // console.log("Cancel deletion");
      },
    });
  };

  return (
    <div>
      {outfits.map((o) => (
        <ul key={o.id}>
          <li>Combination Name: {o.combination_name}</li>

          <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <Carousel dots={false} arrows={true}>
              <div>
                <img
                  src={`${apiurl}/${o.combination_image}`}
                  alt="Combination"
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
              </div>

              <div>
                <img
                  src={`${apiurl}/${o.outfit_1.image}`}
                  alt={o.outfit_1.name}
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
              </div>

              <div>
                <img
                  src={`${apiurl}/${o.outfit_2.image}`}
                  alt="Saree 2"
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
                <h5>{o.outfit_1.name}</h5>
              </div>
            </Carousel>
          </div>

          <Button type="primary" danger onClick={() => showConfirm(o.id)}>
            Remove
          </Button>
        </ul>
      ))}

      {/* Button to add new outfit */}
      <button onClick={() => Navigate('/addoutfit')}>ADD OUTFIT</button>
    </div>
  );
};

export default Outfits;
