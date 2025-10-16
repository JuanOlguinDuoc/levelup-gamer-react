import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './DetailBlog.css'

export default function DetailBlog() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  // Datos de ejemplo para los blogs - en una app real esto vendría de una API
  const blogData = {
    "mejores-ofertas-gaming-mes": {
      id: 1,
      title: "Las mejores ofertas de gaming para este mes",
      author: "Level Up Team",
      date: "15 de Octubre, 2025",
      category: "Ofertas",
      image: "/images/logos/logo\.png",
      excerpt: "Descubre increíbles descuentos en los videojuegos más populares, desde títulos AAA hasta indies únicos.",
      content: `
        <p>Este mes traemos una selección especial de las mejores ofertas en videojuegos que no puedes dejar pasar. Desde títulos AAA hasta joyas indies, hemos recopilado los descuentos más atractivos para nuestra comunidad gamer.</p>
        
        <h3>Ofertas Destacadas de la Semana</h3>
        <p>Entre las ofertas más llamativas de esta semana encontramos:</p>
        <ul>
          <li><strong>Devil May Cry 5:</strong> 70% de descuento - Solo $30.000</li>
          <li><strong>Cyberpunk 2077:</strong> 60% de descuento - Solo $25.000</li>
          <li><strong>The Witcher 3 Complete Edition:</strong> 80% de descuento - Solo $15.000</li>
          <li><strong>Red Dead Redemption 2:</strong> 50% de descuento - Solo $35.000</li>
        </ul>
        
        <h3>Consejos para Aprovechar las Ofertas</h3>
        <p>Para sacar el máximo provecho de estas ofertas, te recomendamos:</p>
        <ol>
          <li>Crear una lista de deseos para recibir notificaciones</li>
          <li>Comparar precios en diferentes plataformas</li>
          <li>Verificar los requisitos del sistema antes de comprar</li>
          <li>Leer reseñas de otros jugadores</li>
        </ol>
        
        <p>No olvides que estas ofertas son por tiempo limitado, así que asegúrate de aprovecharlas antes de que expiren.</p>
      `,
      tags: ["ofertas", "descuentos", "videojuegos", "AAA"]
    },
    "guia-armar-primer-pc-gamer": {
      id: 2,
      title: "Guía completa para armar tu primer PC Gamer",
      author: "Tech Expert",
      date: "12 de Octubre, 2025",
      category: "Hardware",
      image: "/images/logos/logo\.png",
      excerpt: "Todo lo que necesitas saber para construir la configuración perfecta según tu presupuesto.",
      content: `
        <p>Armar tu primer PC gamer puede parecer intimidante, pero con la guía correcta es más sencillo de lo que imaginas. Te acompañamos paso a paso en este emocionante proceso.</p>
        
        <h3>Componentes Esenciales</h3>
        <p>Para armar un PC gamer necesitas estos componentes básicos:</p>
        <ul>
          <li><strong>Procesador (CPU):</strong> El cerebro de tu PC</li>
          <li><strong>Tarjeta Gráfica (GPU):</strong> El componente más importante para gaming</li>
          <li><strong>Memoria RAM:</strong> Para un rendimiento fluido</li>
          <li><strong>Almacenamiento:</strong> SSD para velocidad, HDD para capacidad</li>
          <li><strong>Placa Madre:</strong> Conecta todos los componentes</li>
          <li><strong>Fuente de Poder:</strong> Alimenta todo el sistema</li>
          <li><strong>Gabinete:</strong> Protege y organiza los componentes</li>
        </ul>
        
        <h3>Presupuestos Recomendados</h3>
        <p>Según tu presupuesto, estas son nuestras recomendaciones:</p>
        <h4>Entrada ($800.000 - $1.200.000):</h4>
        <p>Ideal para juegos en 1080p con configuraciones medias-altas.</p>
        
        <h4>Gama Media ($1.200.000 - $2.000.000):</h4>
        <p>Perfecto para 1440p y algunos juegos en 4K con buena calidad.</p>
        
        <h4>High-End ($2.000.000+):</h4>
        <p>Para 4K sin compromisos y las máximas configuraciones.</p>
        
        <p>Recuerda que siempre puedes empezar con una configuración básica y ir actualizando componentes gradualmente.</p>
      `,
      tags: ["hardware", "PC", "gaming", "guía", "componentes"]
    },
    "lanzamientos-esperados-trimestre": {
      id: 3,
      title: "Los lanzamientos más esperados del próximo trimestre",
      author: "Game Analyst",
      date: "10 de Octubre, 2025",
      category: "Noticias",
      image: "/images/logos/logo\.png",
      excerpt: "Mantente al día con los títulos que están por revolucionar la industria del gaming.",
      content: `
        <p>El próximo trimestre promete ser emocionante para los gamers, con lanzamientos que pueden cambiar el panorama de la industria. Aquí te contamos todo sobre los títulos más esperados.</p>
        
        <h3>Grandes Lanzamientos AAA</h3>
        <p>Los estudios más importantes nos traen secuelas muy esperadas:</p>
        <ul>
          <li><strong>Hogwarts Legacy:</strong> El mundo mágico como nunca antes</li>
          <li><strong>Starfield:</strong> La nueva IP de Bethesda para explorar el espacio</li>
          <li><strong>Spider-Man 2:</strong> Continuación de la exitosa saga de Insomniac</li>
          <li><strong>Final Fantasy XVI:</strong> El regreso de la icónica franquicia</li>
        </ul>
        
        <h3>Joyas Indies a Seguir</h3>
        <p>El panorama independiente también nos sorprende:</p>
        <ul>
          <li><strong>Hollow Knight: Silksong:</strong> La esperada secuela</li>
          <li><strong>Ori and the Will of the Wisps 2:</strong> Más aventuras mágicas</li>
          <li><strong>Cuphead: The Delicious Last Course:</strong> DLC del clásico indie</li>
        </ul>
        
        <h3>Innovaciones Tecnológicas</h3>
        <p>Estos lanzamientos traerán nuevas tecnologías:</p>
        <ol>
          <li>Ray Tracing mejorado en tiempo real</li>
          <li>Soporte para pantallas de 120Hz nativos</li>
          <li>Integración con realidad virtual</li>
          <li>Nuevas técnicas de inteligencia artificial</li>
        </ol>
        
        <p>Prepárate para una experiencia gaming completamente nueva con estos lanzamientos.</p>
      `,
      tags: ["lanzamientos", "gaming", "noticias", "próximamente"]
    },
    "consejos-mejorar-setup-gaming": {
      id: 4,
      title: "Consejos para mejorar tu setup gaming",
      author: "Setup Master",
      date: "8 de Octubre, 2025",
      category: "Setup",
      image: "/images/logos/logo\.png",
      excerpt: "Optimiza tu espacio de juego con estos tips profesionales.",
      content: `
        <p>Un buen setup gaming no solo se trata de tener el mejor hardware, sino de crear un ambiente que maximice tu rendimiento y comodidad durante las largas sesiones de juego.</p>
        
        <h3>Ergonomía: La Base del Éxito</h3>
        <p>La comodidad es fundamental para rendir al máximo:</p>
        <ul>
          <li><strong>Silla ergonómica:</strong> Invierte en una buena silla gaming</li>
          <li><strong>Altura del monitor:</strong> La pantalla debe estar a la altura de los ojos</li>
          <li><strong>Posición del teclado:</strong> Los brazos deben formar un ángulo de 90°</li>
          <li><strong>Descansos regulares:</strong> Levántate cada hora</li>
        </ul>
        
        <h3>Iluminación Perfecta</h3>
        <p>La iluminación correcta mejora la experiencia y reduce la fatiga:</p>
        <ol>
          <li>Evita reflejos directos en la pantalla</li>
          <li>Usa luces LED RGB para ambiente</li>
          <li>Iluminación trasera del monitor (bias lighting)</li>
          <li>Control de la luz natural con cortinas</li>
        </ol>
        
        <h3>Organización del Espacio</h3>
        <p>Un espacio ordenado mejora el flujo de trabajo:</p>
        <ul>
          <li><strong>Cable management:</strong> Usa organizadores de cables</li>
          <li><strong>Espacio limpio:</strong> Mantén el escritorio despejado</li>
          <li><strong>Almacenamiento:</strong> Cajones y repisas para accesorios</li>
          <li><strong>Ventilación:</strong> Asegúrate de que el aire circule bien</li>
        </ul>
        
        <h3>Audio de Calidad</h3>
        <p>El sonido es tan importante como la imagen:</p>
        <ul>
          <li>Auriculares gaming de calidad</li>
          <li>Tratamiento acústico básico de la habitación</li>
          <li>Micrófono dedicado para streaming</li>
          <li>Posicionamiento correcto de parlantes</li>
        </ul>
        
        <p>Recuerda que el mejor setup es el que se adapta a tus necesidades y presupuesto. Ve mejorando gradualmente cada aspecto.</p>
      `,
      tags: ["setup", "gaming", "ergonomía", "consejos", "hardware"]
    }
  };

  useEffect(() => {
    // Buscar el blog por slug
    const foundBlog = blogData[slug];
    
    if (foundBlog) {
      setBlog(foundBlog);
      
      // Obtener blogs relacionados (excluyendo el actual)
      const related = Object.entries(blogData)
        .filter(([key, _]) => key !== slug)
        .slice(0, 3)
        .map(([key, blog]) => ({ ...blog, slug: key }));
      
      setRelatedBlogs(related);
    } else {
      // Si no encuentra el blog, redirigir a la página de blogs
      navigate('/blog');
    }
  }, [slug, navigate]);

  const handleRelatedBlogClick = (blogSlug) => {
    navigate(`/blog/${blogSlug}`);
  };



  if (!blog) {
    return (
      <div className="detail-blog-container">
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Cargando artículo...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-blog-container">
      <div className="detail-blog-content">
        {/* Header del artículo */}
        <header className="blog-header">
          <div className="blog-meta">
            <span className="blog-category">{blog.category}</span>
            <span className="blog-date">{blog.date}</span>
          </div>
          
          <h1 className="blog-title">{blog.title}</h1>
          
          <div className="blog-author-info">
            <span>Por <strong>{blog.author}</strong></span>
          </div>
          
          <p className="blog-excerpt">{blog.excerpt}</p>
        </header>

        {/* Imagen principal */}
        <div className="blog-image-container">
          <img src={blog.image} alt={blog.title} className="blog-main-image" />
        </div>

        {/* Contenido del artículo */}
        <article className="blog-content">
          <div 
            className="blog-text"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* Tags */}
        <div className="blog-tags">
          <h4>Tags:</h4>
          <div className="tags-list">
            {blog.tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Blogs relacionados */}
        {relatedBlogs.length > 0 && (
          <section className="related-blogs">
            <h3>Artículos Relacionados</h3>
            <div className="related-blogs-grid">
              {relatedBlogs.map((relatedBlog) => (
                <div 
                  key={relatedBlog.id} 
                  className="related-blog-card"
                  onClick={() => handleRelatedBlogClick(relatedBlog.slug)}
                >
                  <img src={relatedBlog.image} alt={relatedBlog.title} />
                  <div className="related-blog-info">
                    <h4>{relatedBlog.title}</h4>
                    <p>{relatedBlog.excerpt}</p>
                    <span className="read-more">Leer más →</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}