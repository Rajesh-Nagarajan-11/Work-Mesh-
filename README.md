# PSG COLLEGE OF TECHNOLOGY, COIMBATORE – 641 004  
## DEPARTMENT OF COMPUTER APPLICATIONS  

**Academic Year:** 2025–2026  
**Programme:** MCA G1 & G2 – Semester IV  
**Course Code:** 23MX41 – Project Work  

---

## Title of the Project  
**Work Mesh – Smart System for Forming Project Teams**

---

## Student Details  

| Roll No. | Name of the Student | Name of the Faculty Guide |
|--------|---------------------|---------------------------|
| 24MX225 | RAJESH N | Dr. A. Bhuvaneshwari |

---

## Project Goal  

The primary goal of the **Work Mesh** system is to design and develop a smart, automated platform that supports efficient and accurate project team formation. The system aims to analyze uploaded project requirements and intelligently recommend an optimal team by matching required skills, roles, and constraints with available personnel.

Work Mesh seeks to reduce time and effort in project planning, minimize human bias, improve consistency in team selection, and enable faster project initiation compared to traditional manual approaches. Ultimately, the goal is to enhance organizational productivity, streamline workflows, and improve overall project execution through data-driven team formation.

---

## Project Abstract  

Today, projects within organizations are increasingly complex and time-sensitive, requiring smarter team formation efforts. The traditional manual process of forming project teams takes significant time and effort and relies heavily on individual judgment. This creates a growing need for a smarter and more systematic approach to supporting project team formation.

**Work Mesh** is a smart system designed to automate and support the team formation process by allowing users to upload project requirements, which the system analyzes to recommend a suitable project team. By providing data-driven insights, Work Mesh assists decision-makers with a structured and efficient approach to team creation.

By simplifying and automating this process, the system helps organizations save time, reduce manual effort during project planning, enable faster and more consistent team formation, and support smoother project initiation and improved overall workflow and project execution.

---

## Project Flow Analysis  

### Existing System  

In the existing system, project team formation is carried out manually by project managers or HR personnel. The selection of team members is mainly based on individual experience, availability, and personal judgment. This approach does not use any intelligent or data-driven mechanism to analyze project requirements or employee skills. As a result, the process is time-consuming, subjective, and may lead to inconsistent team selection, especially for complex and time-sensitive projects.

Organizations also use project management tools such as **Jira**, **Asana**, and **Trello** to manage tasks and track project progress. These tools focus primarily on task assignment, scheduling, and collaboration. However, they do not provide automated support for forming project teams. Team members must be assigned manually, and there is no built-in feature to recommend an optimal team based on project requirements, skills, or constraints. Therefore, the existing system offers limited support for efficient and intelligent team formation.

---

### Outcome of the Proposed Project  

- The system efficiently analyzes project requirements and recommends a suitable project team, reducing dependency on manual judgment.  
- It minimizes the time and effort required for team formation, enabling faster project initiation.  
- The system ensures better alignment between project needs and team member skills, leading to improved project execution.  
- It provides a structured and consistent approach to team creation across different projects.  
- The decision-making process is supported through data-driven recommendations, improving accuracy and reliability.  
- Overall workflow efficiency is enhanced, contributing to better resource utilization within the organization.  

---

## Modules of the Proposed Project – Functional Requirements  

- **User Authentication Module**  
  Manages user login and logout, assigns roles such as Admin, HR Manager, and Project Manager, and controls access to system features.

- **Employee Management Module**  
  Stores and manages employee details including skills, experience, department, and availability. Allows adding, updating, searching, and removing employee records.

- **Project Requirements Module**  
  Allows users to enter or upload project details such as required skills, team size, project duration, and complexity.

- **Requirement Analysis & Matching Module**  
  Analyzes project requirements and matches them with employee data to compute suitability scores.

- **Team Recommendation & Customization Module**  
  Generates ranked team recommendations and allows manual adjustments.

- **Team Approval & Assignment Module**  
  Supports final team approval, assigns members to projects, and updates employee availability.

- **Notification Module**  
  Sends alerts to team members about assignments and informs managers of pending approvals.

---

## Non-Functional Requirements  

- **Performance**  
  The system should respond quickly and generate team recommendations within 3–5 seconds, even when multiple users are using the system concurrently.

- **Accuracy**  
  The system should correctly recommend suitable team members based on skills, experience, and availability with at least 85% accuracy.

- **Scalability**  
  The system should support organizational growth by handling up to 5000 employees and 500 active projects without performance degradation.

- **Security**  
  The system should securely store user and employee data using encrypted passwords, role-based access control, and secure (HTTPS) communication.

- **Reliability**  
  The system should operate reliably with minimal failures, ensure data consistency, support quick recovery from errors, and maintain stable performance during concurrent usage.

---

## Project Deliverables  

- A web-based **Work Mesh** application for project team formation with user authentication, employee management, and role-based access control.  
- A project requirement analysis module to identify required skills by parsing uploaded project requirements and extracting key criteria for team formation.  
- A skill-based team recommendation module considering experience, availability, and workload balance using an intelligent matching algorithm to generate optimal team suggestions.  
- Structured team suggestions to support manager decision-making with match scores, skill alignment details, and justification for each recommended team member.  
- A web interface for managers to review, modify, and finalize teams with options to manually adjust recommendations and approve final team compositions.  

---

## Technology to Be Used  

### Frontend  
- React.js  
- Tailwind CSS  

### Backend  
- Node.js  
- Express.js  

### Database  
- MongoDB  

### AI / ML  
- Python  

---

## Timeline of Activities Planned  

| Sprint | Activities | Duration |
|------|------------|----------|
| Sprint 1 | Requirement Analysis and Project Setup | Jan 05 – Jan 20 |
| Sprint 2 | Database Design and Employee Management Module | Jan 21 – Feb 10 |
| Sprint 3 | Team Matching Algorithm and Backend Development | Feb 11 – Mar 02 |
| Sprint 4 | Frontend Development and User Interface Design | Mar 03 – Mar 20 |
| Sprint 5 | Integration, Notification Module, and Dashboard | Mar 21 – Apr 05 |
| Sprint 6 | Testing, Documentation, and Final Submission | Apr 06 – Apr 10 |

---
