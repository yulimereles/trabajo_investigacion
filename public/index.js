const imagesLocal = document.querySelector("#galeriaLocal");
const imagesRemota = document.querySelector("#galeriaRemota");
const alertBanner = document.querySelector("#alertBanner");
const bannerMessage = document.querySelector("#bannerMessage");

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM Cargado");

  try {
    const images = await fetchImages();
    showImages(images);
  } catch (error) {
    console.log(error);
  }
});

const showImages = (images) => {
  if (images.length === 0) {
    imagesLocal.innerHTML = `
          <p>
              <span class="text-center">No hay imagenes aún.</span>
          </p>
      `;
    return;
  }

  images.forEach((image) => {
    // console.log(image);
    imagesLocal.innerHTML += `
            <figure id="${image.id}" class="figure col-3">
            <input type="button" onclick="deleteImage(${image.id})" value="x" class="btn btn-danger btn-sm position-absolute">X</input>
            <img src="http://localhost:4000/api/${image.id}/show" class="figure-img img-fluid rounded" alt="...">
              <figcaption class="figure-caption text-end">Imagen Local</figcaption>
            </figure>
              `;
    imagesRemota.innerHTML += `
              <figure id="${image.id}-rm" class="figure col-3">
                <input type="button" onclick="deleteImage(${image.id})" value="x" class="btn btn-danger btn-sm position-absolute">X</input>
                <img src="${image.url}" class="figure-img img-fluid rounded" alt="...">
                <figcaption class="figure-caption text-end">Imagen Alojada en Cloudinary</figcaption>
              </figure>
                `;
  });
};

const deleteImage = async (id) => {


  const response = await fetch(`http://localhost:4000/api/${id}/destroy`, {
    method: "DELETE",
  });
  
  const data = await response.json();
  console.log(data);
  if (response.status === 200) {
    bannerMessage.innerHTML = data.success;
    alertBanner.classList.add("show");
    const imglocal = document.getElementById(`${id}`);      
    const lmgremote = document.getElementById(`${id}-rm`);  
    imagesLocal.removeChild(imglocal)
    imagesRemota.removeChild(lmgremote)
  }else{
    bannerMessage.innerHTML = data.message;
    alertBanner.classList.add("show");
  }

};

const fetchImages = async () => {
  const response = await fetch("http://localhost:4000/api");

  if (response.status === 404) {
    return [];
  }

  const data = await response.json();
  // console.log(data);
  return data;
};