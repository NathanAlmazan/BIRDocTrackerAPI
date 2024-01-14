--
-- Data for Name: BirOffices
--

COPY public."BirOffices" ("officeId", "officeName", "refNum") FROM stdin;
4	Administrative & Human Resource Management Division	RR6-5
5	Assessment Division	RR6-1
6	Finance Division	RR6-4
7	Legal Division	RR6-3
8	Collection Division	RR6-2
9	Regional Investigation Division	RR6-6
10	Document Processing Division	RR6-7
11	Revenue District Office 29	RDO29
12	Revenue District Office 30	RDO30
13	Revenue District Office 31	RDO31
14	Revenue District Office 32	RDO32
15	Revenue District Office 33	RDO33
16	Revenue District Office 34	RDO34
17	Revenue District Office 36	RR636
3	Client Support Unit	RR6-CSU
1	Office of the Regional Director	RR6
2	Office of the Assistant Regional Director	RR6
\.

--
-- Data for Name: DocumentStatus
--

COPY public."DocumentStatus" ("statusId", "statusLabel") FROM stdin;
1	Complied/Closed
2	In-Progress
3	FYI & No Action Needed
4	FYI & Strict Compliance
5	For Approval
6	For Follow-up
\.

--
-- Data for Name: DocumentPurpose
--

COPY public."DocumentPurpose" ("purposeId", "purposeName", "initStatusId") FROM stdin;
3	Investigation	\N
4	Initial	\N
5	Signature	\N
7	Necessary Action	\N
9	Study and Report	\N
1	Approval	5
6	As Required	4
8	See Me	1
11	Verification	5
12	File	1
13	Transmittal with Docket	\N
14	Letter with Docket	\N
18	Docket	\N
16	1st Indorsement with Docket	\N
17	2nd Indorsement with Docket	\N
2	Comment	\N
15	Memo with Docket	\N
10	For Your Information	3
\.


--
-- Data for Name: DocumentTypes
--

COPY public."DocumentTypes" ("docId", "docType", actionable) FROM stdin;
4	Letter with Attachment	t
5	Letter	t
6	Letter Received via Registered Mail	t
7	Email with Attachment	t
8	Copy of Email Received with Attachment	t
9	Copy of Email Received	t
10	First Indorsement with Attachment	t
11	Second Indorsement with Attachment	t
12	Compliance with Attachment	t
13	Show Cause Order	t
14	Revenue Special Order	t
16	Transmittal	t
17	Warrant of Distraint	t
18	LPN with Attachment	t
19	Affidavit	t
20	Advance Copy sent via email	t
15	Operations Memo	f
1	Memo with Attachment	f
2	Memo received via Email	f
3	Memo	f
\.


--
-- Data for Name: OfficeSections
--

COPY public."OfficeSections" ("sectionId", "sectionName", "officeId", "refNum", positions) FROM stdin;
5	Human Resource Management Section	4	\N	\N
6	General Services Section	4	\N	\N
7	Procurement, Property and Accountable Forms Section	4	\N	\N
8	Records Section	4	\N	\N
9	default	5	\N	\N
10	Office Audit Section	5	\N	\N
11	Review & Evaluation Section	5	\N	\N
12	Assessment Programs and Performance Audit Section	5	\N	\N
14	Vat Audit Section	5	\N	\N
15	default	6	\N	\N
16	Disbursement Accounting Section	6	\N	\N
17	Budget Section	6	\N	\N
18	Revenue Accounting Section	6	\N	\N
20	default	7	\N	\N
21	Law & Appellate Section	7	\N	\N
22	Litigation & Prosecution Section	7	\N	\N
23	Personnel and Adjudication Section	7	\N	\N
25	default	8	\N	\N
27	Collection Program & Performance Audit Section	8	\N	\N
28	Withholding Agents Monitoring Section	8	\N	\N
30	Area Management Section	8	\N	\N
31	default	9	\N	\N
33	Tax Fraud Investigation Section	9	\N	\N
34	Intelligence Operations Section	9	\N	\N
35	default	10	\N	\N
37	Suspense Resolution Section	10	\N	\N
38	Document Control Section	10	\N	\N
39	Data Capture Section	10	\N	\N
40	default	11	\N	\N
41	Office of the Revenue District Officer	11	\N	\N
42	Office of the Assistant Revenue District Officer	11	\N	\N
48	default	12	\N	\N
49	Office of the Revenue District Officer	12	\N	\N
50	Office of the Assistant Revenue District Officer	12	\N	\N
56	default	13	\N	\N
57	Office of the Revenue District Officer	13	\N	\N
58	Office of the Assistant Revenue District Officer	13	\N	\N
64	default	14	\N	\N
65	Office of the Revenue District Officer	14	\N	\N
66	Office of the Assistant Revenue District Officer	14	\N	\N
72	default	15	\N	\N
73	Office of the Revenue District Officer	15	\N	\N
74	Office of the Assistant Revenue District Officer	15	\N	\N
80	default	16	\N	\N
81	Office of the Revenue District Officer	16	\N	\N
82	Office of the Assistant Revenue District Officer	16	\N	\N
88	default	17	\N	\N
89	Office of the Revenue District Officer	17	\N	\N
90	Office of the Assistant Revenue District Officer	17	\N	\N
13	Tax Billing Section	5	\N	\N
29	Tax Clearance Section	8	\N	\N
1	default	1	\N	\N
2	default	2	\N	\N
3	default	3	\N	\N
4	default	4	\N	\N
32	Administrative Section	9	\N	\N
36	Administrative Section	10	\N	\N
19	Administrative Section	6	\N	\N
24	Administrative & Records Section	7	\N	\N
26	Administrative Section	8	\N	\N
45	Compliance Section	11	3	\N
43	Administrative Section	11	1	\N
59	Administrative Section	13	1	\N
67	Administrative Section	14	1	\N
75	Administrative Section	15	1	\N
83	Administrative Section	16	1	\N
91	Administrative Section	17	1	\N
60	Assessment Section	13	2	\N
68	Assessment Section	14	2	\N
76	Assessment Section	15	2	\N
84	Assessment Section	16	2	\N
92	Assessment Section	17	2	\N
44	Assessment Section	11	2	\N
52	Assessment Section	12	2	\N
53	Compliance Section	12	3	\N
61	Compliance Section	13	3	\N
69	Compliance Section	14	3	\N
77	Compliance Section	15	3	\N
85	Compliance Section	16	3	\N
93	Compliance Section	17	3	\N
46	Collection Section	11	4	\N
54	Collection Section	12	4	\N
62	Collection Section	13	4	\N
70	Collection Section	14	4	\N
78	Collection Section	15	4	\N
86	Collection Section	16	4	\N
94	Collection Section	17	4	\N
47	Client Support Section	11	5	\N
55	Client Support Section	12	5	\N
63	Client Support Section	13	5	\N
71	Client Support Section	14	5	\N
79	Client Support Section	15	5	\N
87	Client Support Section	16	5	\N
95	Client Support Section	17	5	\N
104	Office of the Division Chief	4	\N	\N
105	Adminstrative Section	12	\N	\N
\.

--
-- Data for Name: Roles
--

COPY public."Roles" ("roleId", "roleName", superuser) FROM stdin;
3	Revenue District Officer	f
4	Asst. Revenue District Officer	f
6	Asst. Division Chief	f
7	Section Chief	f
8	Technical Staff	f
9	Administrative Officer/Staff	f
1	Regional Director	t
2	Asst. Regional Director	t
5	Division Chief	f
10	System Admin	t
\.

--
-- Data for Name: ThreadTags
--

COPY public."ThreadTags" ("tagId", "tagName") FROM stdin;
1	Top Priority
2	Confidential
3	For Follow Up
\.

--
-- Data for Name: UserAccounts
--

COPY public."UserAccounts" ("accountId", "firstName", "lastName", "officeId", password, "resetCode", active, subscription, "roleId", "signImage") FROM stdin;
255b9194-b964-4e43-b8ba-02b3f4d81ad9	Charlie	Esto	36	$2b$12$KCwRzlP7H8y6zzlQ73PFf.WspgTKJUSUaKo1fBsYr2DtF.N.WvnAi    j1wrhc	t   \N  5	\N
ee401ea6-fda2-4053-a329-5f532f4bc601	Renato	Molina	1	$2b$12$b/uhDzIWDmFZS678qkUCr.ZQEBceMUvXrdYem.MzFZekW2jootakq	kxncs   t   \N  1	\N
\.