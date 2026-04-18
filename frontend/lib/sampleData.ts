import type { OpportunityType } from "./types";

export const SAMPLE_EMAILS = `---------- Forwarded message ---------
From: HEC Scholarships <scholarships@hec.gov.pk>
To: students@nu.edu.pk
Date: Mon, 14 Apr 2026 09:12:00 +0500
Subject: HEC Need-Based Scholarship 2026 – Applications Open

Dear Students,

The Higher Education Commission of Pakistan is pleased to announce the HEC Need-Based Scholarship Program 2026 for undergraduate students currently enrolled in HEC-recognized universities.

Eligibility:
- Pakistani national enrolled in BS/BE program
- Minimum CGPA: 2.5
- Annual family income below PKR 500,000
- Semester 2 through 8

Required Documents:
- CNIC copy
- Income certificate from NADRA/Union Council
- Academic transcripts
- Bank statement (last 6 months)

Deadline: 30 April 2026

Apply at: https://scholarships.hec.gov.pk/need-based-2026

For queries: scholarships@hec.gov.pk

---

---------- Forwarded message ---------
From: Fulbright Pakistan <fulbright@usefpakistan.org>
To: highachievers@gmail.com
Date: Tue, 15 Apr 2026 11:00:00 +0500
Subject: Fulbright MS/PhD Program 2026-27 – Last Call

The United States Educational Foundation in Pakistan (USEFP) invites applications for the Fulbright Scholarship Program for the academic year 2026-27.

Program: MS or PhD at a US university (fully funded)
Eligibility:
- Pakistani citizen
- Minimum 16 years of education (Bachelor's degree)
- Minimum CGPA: 3.0 or equivalent
- Strong academic and leadership record

Award Includes: Tuition, living allowance, travel, health insurance

Required Documents:
- Statement of Purpose
- Three recommendation letters
- GRE/TOEFL scores (if available)
- Academic transcripts

Application Deadline: 1 May 2026

Apply: https://www.usefpakistan.org/fulbright

Contact: fulbright@usefpakistan.org

---

---------- Forwarded message ---------
From: Tintash Careers <careers@tintash.com>
To: cs-students@nu.edu.pk
Date: Wed, 16 Apr 2026 14:30:00 +0500
Subject: Software Engineer Intern – Tintash (Lahore) – Summer 2026

Hi there,

Tintash is hiring Software Engineer Interns for Summer 2026!

About Tintash: Award-winning product studio based in Lahore, working with US/EU clients.

Role: Software Engineer Intern (3 months, paid)
Location: Lahore (on-site, DHA Phase 5)

Requirements:
- CS/SE/IT undergraduate (Semester 4+)
- Strong in: Python, React, or Node.js
- Minimum CGPA: 3.0

What you'll work on: Real client products, not toy projects.

Perks: Competitive stipend, mentorship, possible full-time offer.

To Apply: Send your CV to careers@tintash.com with subject "SWE Intern Summer 2026"

Deadline: 25 April 2026

---

---------- Forwarded message ---------
From: Google Developer Student Clubs <dscp@google.com>
To: university-students@googlegroups.com
Date: Thu, 10 Apr 2026 10:00:00 +0500
Subject: Google Solution Challenge 2026 – Register Your Team Now

Hello Developers,

The Google Solution Challenge 2026 is now open for registration! Build solutions addressing the UN Sustainable Development Goals using Google technologies.

Who can participate:
- University students worldwide
- Teams of 1-4 members
- GDSC members preferred (join for free at gdsc.community.dev)

Technologies: Android, Flutter, Firebase, Google Cloud, TensorFlow

Prizes: Top 3 global teams win $3,000 each + Google Summit trip

Registration Deadline: 22 April 2026
Submission Deadline: 28 May 2026

Register: https://developers.google.com/community/gdsc-solution-challenge

No minimum CGPA required.

---

---------- Forwarded message ---------
From: MLH Fellowship <fellowship@mlh.io>
To: developers@hackers.io
Date: Fri, 11 Apr 2026 08:00:00 +0500
Subject: MLH Fellowship – Spring/Summer 2026 Applications Open

Hey,

MLH Fellowship applications for Spring/Summer 2026 are now open!

About: 12-week remote fellowship contributing to open-source projects used by millions.

Tracks:
- Open Source (contribute to top GitHub repos)
- Explorer (build your own project)
- Production Engineering (partner companies)

Stipend: $5,000 for 12 weeks
Location: Remote (worldwide)
Duration: June – August 2026

Eligibility:
- Currently enrolled student OR recent grad (within 1 year)
- Strong GitHub portfolio preferred
- No CGPA requirement

Apply by: 10 May 2026

Apply here: https://fellowship.mlh.io

---

---------- Forwarded message ---------
From: Udemy Business <noreply@udemy.com>
To: subscriber@gmail.com
Date: Sat, 12 Apr 2026 09:00:00 +0500
Subject: 🔥 FLASH SALE: All Courses PKR 449 – Today Only!

Hi there,

Don't miss our BIGGEST sale of the year!

🎓 Python for Data Science – PKR 449 (was PKR 8,999)
🎓 Complete Web Developer Bootcamp – PKR 449
🎓 Machine Learning A-Z – PKR 449

Sale ends TONIGHT at 11:59 PM!

Use code: FLASH449

Shop now: https://www.udemy.com/deals

Unsubscribe | Privacy Policy

---

---------- Forwarded message ---------
From: FAST-NU Academic Affairs <academics@nu.edu.pk>
Date: Sun, 13 Apr 2026 10:00:00 +0500
Subject: Elective Course Registration – Summer 2026

Dear Students,

Summer 2026 elective course registration is now open on SLATE.

Available Courses:
- CS-471: Deep Learning (3 credit hours)
- CS-452: Cloud Computing (3 credit hours)
- SE-410: Mobile Application Development (3 credit hours)

Registration Deadline: 20 April 2026
Classes begin: 1 May 2026

Login at: https://slate.nu.edu.pk

Note: Maximum 2 electives per student.

---

---------- Forwarded message ---------
From: research.lab@pieas.edu.pk
To: ml-students@list.pk
Date: Mon, 7 Apr 2026 15:00:00 +0500
Subject: Research Position – AI/ML Lab PIEAS

We are looking for motivated students to join our AI/ML research group at PIEAS.

Position: Research Associate (part-time, unpaid initially)
Requirements: Strong background in ML, Python, PyTorch
Duration: 6 months with possible stipend after 3 months
Deadline: (not mentioned)

If interested, send your CV and a brief statement of interest.
Contact: research.lab@pieas.edu.pk

`;

export const DEFAULT_PROFILE = {
  name: "Ali Hassan",
  degree: "Computer Science",
  semester: 6,
  cgpa: 3.2,
  skills: ["Python", "React", "Machine Learning", "Node.js"],
  preferredTypes: ["internship", "fellowship", "scholarship"] as OpportunityType[],
  financialNeed: true,
  location: "Lahore",
  experience: "1 year freelance web development, GDSC member",
};
