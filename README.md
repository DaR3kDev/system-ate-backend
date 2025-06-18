# 📦 Sistema de Toma de Beneficios

## 🧾 Descripción

Este sistema fue desarrollado para gestionar eficientemente la **toma de beneficios por parte de los afiliados y sus hijos**. El objetivo principal es llevar un control riguroso sobre la entrega de beneficios, permitiendo registrar de forma ordenada qué afiliados han recibido beneficios, cuántos de ellos tienen hijos, y en qué sucursales se realizó la entrega.

## 🎯 Objetivos del sistema

* Registrar la toma de beneficios por parte de los afiliados.
* Asociar a los hijos de cada afiliado para que reciban los beneficios correspondientes.
* Controlar y auditar la entrega por cada sucursal.
* Llevar un conteo preciso del inventario y de los beneficiarios.
* Permitir la trazabilidad de los datos en todo el proceso.

## ⚙️ Tecnología

* **NestJS**: Backend modular y escalable.
* **Prisma ORM**: Mapeo de modelos de base de datos y consultas robustas.
* **PostgreSQL**: Motor de base de datos relacional.
* `.env` para configuración sensible (base de datos, puertos, etc.)

## 🧠 Lógica del sistema

La lógica gira en torno a estos componentes clave:

1. **Usuarios (`User`)**: Administradores o empleados del sistema.
2. **Afiliados (`Affiliates`)**: Personas registradas que pueden recibir beneficios.
3. **Hijos (`Children`)**: Relacionados a un afiliado; también pueden recibir beneficios.
4. **Delegados (`Delegates`)**: Encargados de distribuir beneficios, asociados a sucursales.
5. **Sectores (`Sectors`)**: Sucursales donde se realiza la entrega.
6. **Beneficios (`Benefits`)**: Productos, servicios o ayudas que se entregan.
7. **Distribución (`Benefit_distribution`)**: Registro de qué beneficio se entregó, a quién, cuándo, y cuántos.
8. **Eventos (`Events`)**: Actividades organizadas como campañas, talleres, etc.

## 📈 Diagrama de flujo (texto)
![image](https://github.com/user-attachments/assets/8caa5c59-3603-42e3-9592-20e5774f8815)
![image](https://github.com/user-attachments/assets/f4255960-f69f-4da7-b112-fc657f932bb9)

## 🗃️ Modelo de Datos
![Untitled](https://github.com/user-attachments/assets/5959c8d8-eb20-42e1-a2e3-e9019800bb27)
