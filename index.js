const MyCanvas = (() => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.src = 'initial.png';

  img.addEventListener("load", () => {
    console.log('img.load');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  });

  const makeFilterWith = wasm => {
    return {
      apply: () => {
        const photonImage = wasm.open_image(canvas, ctx);
        const currentFilter = wasm.apply_some_filter(photonImage);
        wasm.putImageData(canvas, ctx, photonImage);
        return currentFilter;
      }
    }
  };

  const updateImage = src => {
    img.src = src;
  };

  return { makeFilterWith, updateImage };
})();

const makeFilterSwitch = filter => {
  const currentFilterNode = document.getElementById("filter-name").firstChild;
  document.getElementById('apply-filter-button').addEventListener("click", () => {
    const currentFilter = filter.apply();
    currentFilterNode.nodeValue = currentFilter;
  });

  const deleteFilterName = () => {
    currentFilterNode.nodeValue = 'None';
  }

  return { deleteFilterName };
};

const initializeFileSwitch = (filterSwitch) => {
  const fileInput = document.getElementById('file-input');
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      MyCanvas.updateImage(reader.result);
      filterSwitch.deleteFilterName();
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      console.error("Failed to read a file");
    }
  });
};

import('./pkg/sd_2021_03_intro_wasm.js').then(wasm => {
  const filter = MyCanvas.makeFilterWith(wasm);
  const filterSwitch = makeFilterSwitch(filter);
  initializeFileSwitch(filterSwitch);
});
