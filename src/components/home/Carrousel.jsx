import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carrousel.css";
import { getProductos } from '../../service/localStorage';

const productos = getProductos();



const Carrousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    pauseOnHover: true,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {productos.map(producto => (
          <div key={producto.id} className="slide">
            <img src={producto.imagenUrl} alt={producto.titulo} className="slide-image" />
            <div className="slide-overlay">
              <h2 className="slide-title">{producto.titulo}</h2>
              <button className="slide-button">Ver Detalle</button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carrousel;
