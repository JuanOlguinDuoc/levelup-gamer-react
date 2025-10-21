import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carrousel.css";
import { getProductos } from '../../service/localStorage';
import { Link } from 'react-router-dom';

const Carrousel = () => {
  const productos = getProductos();

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    pauseOnHover: true,
    fade: true,
    cssEase: "cubic-bezier(0.87, 0.03, 0.41, 0.9)",
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {productos.slice(0, 5).map(producto => (
          <div key={producto.id} className="slide">
            <img src={producto.imagenUrl} alt={producto.titulo} className="slide-image" />
            <div className="slide-overlay">
              <div className="slide-content">
                <h2 className="slide-title">{producto.titulo}</h2>
                <p className="slide-price">{formatPrice(producto.precio)}</p>
                <p className="slide-description">{producto.atributos}</p>
                <Link to={`/product/${producto.id}`} className="slide-button">
                  Ver Detalle
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carrousel;
