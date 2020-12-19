import React from "react";

import "./ImagePicker.css";

import Image from '../../Image'

const ImagePicker = (props) => {
  const [state, setState] = React.useState({
    maltiple: false,
    imagesUrls: [],
    imageUrl: ""
  });

  function handleChange(e) {
    if (state.maltiple) {
      const files = e.target.files;
      let updateImagesUrls = [];

      for (let file of files) {
        let reader = new FileReader();
        reader.onload = function(r) {
          updateImagesUrls = [...updateImagesUrls, r.target.result];
          setState({ ...state, imagesUrls: updateImagesUrls });
        };
        reader.readAsDataURL(file);
      }
    } else {
      const file = e.target.files[0];
      props.getImage(file)
      let reader = new FileReader();
      reader.onload = function(r) {
        setState({ ...state, imageUrl: r.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div>
      <input multiple={state.maltiple} onChange={handleChange} type="file" name="image" id="" />
      <div className="preview_image">
        {state.maltiple ? (
          state.imagesUrls.map(imageUrl => {
            return <Image src={imageUrl} waves="green" />
            // return <img src={imageUrl} />;
          })
        ) : (
          <Image src={state.imageUrl} />
        )}
      </div>
    </div>
  );
};

export default ImagePicker;
