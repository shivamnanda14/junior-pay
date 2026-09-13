# Junior Pay 🚀
> Smart, secure pocket money and digital allowance management for modern families. Built by **Shivam Nanda**.

[![Live Demo](https://img.shields.io/badge/Live-Website-5f259f?style=for-the-badge&logo=vercel)](https://junior-pay.onrender.com/)
[![LinkedIn Profile](https://img.shields.io/badge/Connect-LinkedIn-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/shivam-nanda-472289418/)

---

## 💡 The Inspiration & Vision
Managing pocket money in the UPI era is broken. Traditional cash allowances leave children out of the digital economy, while giving kids direct access to standard UPI apps strips away parental visibility and introduces financial risk. 

**Junior Pay** bridges this gap. It acts as a secure, parent-monitored intermediary layer that introduces financial literacy, real-time approval loops, and strict spending boundaries for minors while allowing them to seamlessly pay at local merchants via UPI QR codes.

---

## ⚙️ How It Works (The Core Architecture)
1. **The Request:** The Junior scans a merchant's UPI QR code or manually enters their VPA, specifies an amount, selects a category reason, and inputs their 4-digit security PIN.
2. **The Security Gate:** The backend executes an **Idempotency Check** (blocking duplicate spam requests within a 10-second window) and validates their cumulative daily or monthly limits.
3. **The Guardian Notification:** The request instantly hits the **Parent Suite**. The parent views merchant details, amount, and child notes.
4. **The Settlement:** Upon parent approval, the system triggers a secure test-mode payment gateway interaction, updating balances across all dashboards in real-time.

---

## 🛠️ Tech Stack & Architecture
* **Framework:** Next.js 16 (App Router with Server Actions)
* **Database & ORM:** PostgreSQL (hosted on Neon) managed via Prisma ORM (utilizing global connection pooling to prevent exhaustion)
* **Authentication:** Custom Role-Based Access Control (RBAC) with secure session handling (6-digit PINs for Parents, 4-digit PINs for Juniors)
* **Payments:** Razorpay Integration (Test Mode configuration simulating real-world settlement flows)
* **Styling & UI:** Tailwind CSS with responsive, mobile-first design patterns

---

## ⏱️ Development Iterations & Timeline
Junior Pay was conceptualized, structured, and executed in targeted agile sprints:
* **Phase 1 (Core Data Modeling):** Designed the relational schema for `ParentUser`, `Child`, `ChildConnection`, and `Transaction` models using Prisma.
* **Phase 2 (Auth & Security Hardening):** Implemented role-based login routes, input sanitization, and PIN verification gates.
* **Phase 3 (FinTech Logic & Edge Cases):** Added cumulative daily/monthly limit calculators, dynamic countdown timers for limit resets, and anti-spam idempotency blocks.
* **Phase 4 (Production Deployment):** Configured global Prisma client patterns, automated uptime pings (via cron-job), and deployed to Render.

---

## 🆚 Market Differentiation & Architectural Decisions
Unlike standard peer-to-peer wallet apps or adult UPI handlers, Junior Pay stands out through:
* **Guardian-Centric Oversight:** Multiple parents/guardians can link to a single junior, and parents can oversee shared management structures.
* **Granular Spend Constraints:** Enforces strict daily or monthly spend caps that automatically lock down QR scanning features the moment thresholds are reached.
* **Simulated UPI Gateway Bridge:** Because direct API access to live consumer UPI apps (like PhonePe/GooglePay) requires commercial banking partnerships, Junior Pay bridges this by generating structured payment request bills that route directly into the Parent Suite, paired with test-mode Razorpay execution for seamless portfolio demonstration.

---

## 🔗 Quick Links
* **Live Application:** [https://junior-pay.onrender.com/](https://junior-pay.onrender.com/)
* **Creator Profile:** [LinkedIn - Shivam Nanda](https://www.linkedin.com/in/shivam-nanda-472289418/)

---

## 👨‍💻 Author
Built with passion by **Shivam Nanda**  
*B.Tech CSE, GCE Gaya | MindForge Co-Founder | Learning Now by Shivam Nanda (YouTube)*
