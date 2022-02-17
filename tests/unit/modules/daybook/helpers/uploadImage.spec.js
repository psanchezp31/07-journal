import axios from "axios";
import cloudinary from "cloudinary";
import uploadImage from "@/modules/daybook/helpers/uploadImage";

cloudinary.config({
  cloud_name: "paulis",
  api_key: "785848883831842",
  api_secret: "NH-LqrDuE6hYeIMJVPOPWov8ZLk",
});

describe("pruebas en el uploadImage", () => {
  test("debe de cargar un archivo y retornar el url", async (done) => {   //done es un argumento que se pasa en jest para hacer un timeout
    const { data } = await axios.get(
      "https://res.cloudinary.com/paulis/image/upload/v1645136965/images/crbwc2hjhfsi7nafwaxk.jpg",
      {
        responseType: "arraybuffer",
      }
    ); //acá obtengo la imagen de cloudinary

    const file = new File([data], "foto.jpg");

    const url = await uploadImage(file); //aca se vuelve a subir la foto a cloudinary
    expect(typeof url).toBe("string");

    //Como cada vez que se hace la prueba se sube una imagen, se va a llenar de basura cloudinary, por eso es mejor borrar la imagen despues de subida

    // console.log("url :>> ", url);
    const segments = url.split("/");
    const imageId = segments[segments.length - 1].replace('.jpg', '');
    // console.log('imageId :>> ', imageId);
    cloudinary.v2.api.delete_resources(imageId, {}, ()=>{
        done()
    })
  });
});
