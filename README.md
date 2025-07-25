# Rent a Ride
    
## Tech Stack

**Client:** React, Javascript, Redux Toolkit, Material Ui, TailwindCSS, React Toast 
**Server:** Express.js, Mongodb, Cloudinary, Nodemailer , Multer

## Project Description
A full-scale Car Rental Platform with user, admin, and vendor modules, designed to offer seamless vehicle booking, management, and administration, catering to different user roles with distinct functionalities.

**Key Features & Modules:**

**User Module:**

* View and Book Vehicles: Users can view available vehicles and book them online.
* Order Management: View past and upcoming orders; users can only access their own bookings.
* Email Notifications: After booking a vehicle, users receive an email with order details.

**Admin Module:**
* Booking Management: Admins can view and manage bookings, including booking details and statuses.
* Vendor Management: View and approve/reject vendors, as well as remove vendors from the platform.
* Vehicle Management: Admins can view, update, and delete vehicle listings.
* User Management: Admins have the ability to remove users from the platform.
  
**Vendor Module:**
* Vehicle Listing: Vendors can add their vehicles to the platform for approval by the admin.
* Order Notifications: Vendors receive updates on orders when users book their vehicles.

##

**Features & Implementations:**

* JWT Authentication: Integrated JWT access and refresh tokens to secure user, admin, and vendor login flows.

* Role-Based Access: Implemented protected routes and role-based access to restrict access based on user roles (Admin, User, Vendor).

* Search, Sort, Filter Functionality: Enhanced search, filter, and sort capabilities for seamless vehicle browsing and booking.

* Google OAuth: Integrated Google OAuth for quick and secure sign-up/sign-in functionality.

* Cloudinary Integration: Used Cloudinary to handle image and video storage, reducing the database load by optimizing media assets.

* MongoDB: Used four main models to take advantage of MongoDB's referencing functionality, improving data organization and retrieval efficiency.

* Razorpay payment gatway: Integrated for test transactions in sandbox mode. (Without KYC verification uptill now)
  
## Screenshots

### User
<img width="1440" alt="Screenshot 2024-04-06 at 3 06 32 PM" src="https://github.com/user-attachments/assets/4b769f7d-5d2c-43a7-8283-07fa8402de92">
<img width="1430" alt="Screenshot 2024-12-10 at 12 35 41 AM" src="https://github.com/user-attachments/assets/5d6e0160-5f1d-4e67-a64e-1e18fb17a590">
<img width="1425" alt="Screenshot 2024-12-10 at 12 35 58 AM" src="https://github.com/user-attachments/assets/ac6b0f33-344e-4009-a979-23ea7dc3a5bb">
<img width="1428" alt="Screenshot 2024-12-10 at 1 59 45 AM" src="https://github.com/user-attachments/assets/0e87009c-832d-4c5e-be7c-ecd4df341070">
<img width="1408" alt="Screenshot 2024-12-10 at 2 00 01 AM" src="https://github.com/user-attachments/assets/baf15b5d-2e04-4410-803b-527dddda1aab">
<img src="./client/read_pics/IMG-20250711-WA0002.jpg" alt="User Interface Screenshot 3" width="800">
<img src="./client/read_pics/IMG-20250711-WA0006.jpg" alt="Vendor Interface Screenshot 2" width="800">

### Admin
<img src="./client/read_pics/IMG-20250711-WA0000.jpg" alt="User Interface Screenshot 1" width="800">
<img src="./client/read_pics/IMG-20250711-WA0001.jpg" alt="User Interface Screenshot 2" width="800">
<img src="./client/read_pics/IMG-20250711-WA0003.jpg" alt="Admin Interface Screenshot" width="800">

### Vendor
<img src="./client/read_pics/IMG-20250711-WA0005.jpg" alt="Vendor Interface Screenshot 1" width="800">
