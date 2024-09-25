# Proyecto Digitalización Horno Familiar - Gestión de Eventos

Este proyecto es una aplicación web para la gestión de un horno familiar, permitiendo a los usuarios realizar pedidos en línea, ver noticias, registrarse, iniciar sesión y hacer seguimiento de sus pedidos. La aplicación está construida con **React + Vite** en el frontend y **Node.js + MongoDB** en el backend, asegurando un flujo completo para la gestión de usuarios, pedidos y noticias. Además, incluye integración con **PayPal** para pagos y autenticación mediante **NextAuth**.

## Características

- **Gestión de usuarios**: Registro e inicio de sesión, con roles diferenciados.
- **Pedidos en tiempo real**: Seguimiento del estado de los pedidos (Elaborando, Listo para recoger, Recogido).
- **Autenticación segura**: Contraseñas encriptadas y autenticación basada en tokens JWT.
- **Pagos**: Integración con PayPal para realizar pagos en línea.
- **Noticias**: Sección de noticias y promociones, con imágenes y descripciones.
- **Responsividad**: Interfaz adaptable a móviles, tablets y monitores grandes.
- **IA Chatbot**: Asistencia a clientes mediante un chatbot que proporciona información del horno y productos.

## Requisitos previos

Antes de empezar, asegúrate de tener instalados los siguientes programas:

- **Node.js** (v14 o superior)
- **MongoDB** (local o en la nube, con una instancia configurada)
- **NPM** o **Yarn**

## Instalación y Configuración

Sigue estos pasos para inicializar el proyecto en tu entorno local:

1. **Clonar el repositorio**

    ```bash
    git clone https://github.com/danisentamans/TFM.git
    cd TFM
    ```

2. **Instalar dependencias**

    Ejecuta el siguiente comando para instalar todas las dependencias necesarias del proyecto:

    ```bash
    npm install
    ```

3. **Configurar las variables de entorno**

    Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

    ```bash
    # Configuración del servidor
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/event-management
    JWT_SECRET=your_jwt_secret_key

    # Configuración de PayPal
    PAYPAL_CLIENT_ID=your_paypal_client_id
    PAYPAL_SECRET=your_paypal_secret

    ```

4. **Ejecutar la aplicación**

    Una vez configuradas las dependencias, puedes iniciar el servidor y la base de datos ejecutando:

    ```bash
    npm start
    ```

    La aplicación estará disponible en http://localhost:5173 para el frontend y en http://localhost:5000 para el backend.

## Estructura del Proyecto

A continuación, se presenta una descripción general de las carpetas principales del proyecto:

```bash
.
├── backend               # Lógica del servidor y conexión con MongoDB
│   ├── controllers       # Controladores de las rutas
│   ├── models            # Modelos de la base de datos (Users, Orders, News)
│   ├── routes            # Definición de las rutas de la API
│   ├── middleware        # Middlewares (protección de rutas, autenticación)
│   └── app.js            # Punto de entrada del servidor
├── frontend              # Aplicación de React con Vite
│   ├── components        # Componentes reutilizables (OrderForm, OrderList)
│   ├── pages             # Páginas principales (Login, Register, About, News)
│   ├── services          # Servicios API para interactuar con el backend
│   └── App.jsx           # Componente principal de la aplicación
├── public                # Archivos estáticos (imágenes, favicon, etc.)
├── .env            # Variables de entorno (no se suben a git)
└── README.md             # Este archivo
```

## Funcionalidades Técnicas

# Autenticación

El proyecto utiliza JWT para gestionar la autenticación de usuarios. Se ha implementado autenticación por credenciales (email y contraseña), con protección de rutas para garantizar que solo los usuarios autenticados puedan realizar pedidos o acceder a su historial.

# Integración de PayPal

Se ha implementado la pasarela de pagos PayPal para que los usuarios puedan pagar sus pedidos directamente desde la plataforma. La integración incluye el SDK de PayPal para Node.js y un botón personalizado en el frontend.

# Gestión de Pedidos

Los usuarios pueden realizar pedidos en la plataforma seleccionando productos. El backend gestiona el estado de los pedidos, que puede ser ‘Elaborando’, ‘Listo para recoger’ o ‘Recogido’, y se muestran en tiempo real al usuario.

# Noticias y Promociones

En la sección de noticias, los usuarios pueden ver las últimas promociones y ofertas del horno, con imágenes y descripciones detalladas. Los administradores pueden añadir y editar noticias desde el backend.

# Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.