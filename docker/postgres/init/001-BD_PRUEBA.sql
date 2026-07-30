--
-- PostgreSQL database dump
--

\restrict 270CzJ5Xu1oM7hJnPil1XQMnOQh6fgBQJtnbbNyKOeuaeWPMZNWdd7YDImOJ6zg

-- Dumped from database version 14.22 (Ubuntu 14.22-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.22 (Ubuntu 14.22-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alumno; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alumno (
    id bigint NOT NULL,
    matricula bigint NOT NULL,
    password character varying(50) NOT NULL,
    nombre character varying(50) NOT NULL,
    apellidopaterno character varying(50) NOT NULL,
    apellidomaterno character varying(50) NOT NULL,
    unidad smallint NOT NULL,
    division character varying(3) NOT NULL,
    licenciatura integer NOT NULL,
    estado integer,
    sancion bigint,
    correoinstitucional character varying(50) NOT NULL,
    observaciones text
);


ALTER TABLE public.alumno OWNER TO gestion_user;

--
-- Name: division; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.division (
    id character varying(3) NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.division OWNER TO gestion_user;

--
-- Name: empleado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empleado (
    id bigint NOT NULL,
    noeconomico bigint NOT NULL,
    password text NOT NULL,
    nombre character varying(50) NOT NULL,
    apellidopaterno character varying(50) NOT NULL,
    apellidomaterno character varying(50) NOT NULL,
    correoinstitucional character varying(50) NOT NULL,
    estado integer,
    tipo integer NOT NULL
);


ALTER TABLE public.empleado OWNER TO gestion_user;

--
-- Name: empleado_permiso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empleado_permiso (
    noeconomico bigint NOT NULL,
    idpermiso integer NOT NULL
);


ALTER TABLE public.empleado_permiso OWNER TO gestion_user;

--
-- Name: estado_empleado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_empleado (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.estado_empleado OWNER TO gestion_user;

--
-- Name: licenciatura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.licenciatura (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.licenciatura OWNER TO gestion_user;

--
-- Name: material; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.material (
    id character varying(30) NOT NULL,
    inventario_uam character varying(30),
    inventario_coordinacion character varying(30) NOT NULL,
    marca character varying(50),
    modelo character varying(50),
    numeroserie character varying(50),
    estado integer NOT NULL,
    nombrematerial character varying(50),
    cantidad integer,
    tipo integer NOT NULL,
    descripcion text
);


ALTER TABLE public.material OWNER TO gestion_user;

--
-- Name: material_historial; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.material_historial (
    id integer NOT NULL,
    idmaterial character varying(30) NOT NULL,
    idprestamo character varying(30),
    idempleado integer NOT NULL,
    tipo_evento smallint NOT NULL,
    descripcion_evento text NOT NULL,
    estado_anterior smallint NOT NULL,
    estado_nuevo smallint NOT NULL,
    fecha_evento timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    idtecnico integer
);


ALTER TABLE public.material_historial OWNER TO gestion_user;

--
-- Name: material_historial_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.material_historial_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.material_historial_id_seq OWNER TO gestion_user;

--
-- Name: material_historial_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.material_historial_id_seq OWNED BY public.material_historial.id;


--
-- Name: material_prestamo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.material_prestamo (
    idprestamo character varying(50) NOT NULL,
    idmaterial character varying(30) NOT NULL,
    cantidad integer
);


ALTER TABLE public.material_prestamo OWNER TO gestion_user;

--
-- Name: permisos_empleado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permisos_empleado (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.permisos_empleado OWNER TO gestion_user;

--
-- Name: prestamo; Type: TABLE; Schema: public; Owner: aaeudd
--

CREATE TABLE public.prestamo (
    id character varying(50) NOT NULL,
    solicitante_id bigint NOT NULL,
    solicitante_tipo character varying(20) NOT NULL,
    idempleado bigint NOT NULL,
    estadoprestamo integer NOT NULL,
    fechaprestamo date NOT NULL,
    fechadevolucion date,
    uea bigint,
    grupo character varying(8),
    observaciones text,
    tipoprestamo integer,
    fechaentregado date,
    CONSTRAINT prestamo_solicitante_tipo_check CHECK (((solicitante_tipo)::text = ANY ((ARRAY['ALUMNO'::character varying, 'EMPLEADO'::character varying])::text[])))
);


ALTER TABLE public.prestamo OWNER TO gestion_user;

--
-- Name: prestamo_backup; Type: TABLE; Schema: public; Owner: aaeudd
--

CREATE TABLE public.prestamo_backup (
    id character varying(50),
    idalumno bigint,
    idempleado bigint,
    estadoprestamo integer,
    fechaprestamo date,
    fechadevolucion date,
    uea bigint,
    grupo character varying(8),
    observaciones text,
    tipoprestamo integer,
    fechaentregado date
);


ALTER TABLE public.prestamo_backup OWNER TO gestion_user;

--
-- Name: sancion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sancion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sancion_id_seq OWNER TO gestion_user;

--
-- Name: tipo_empleado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_empleado (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.tipo_empleado OWNER TO gestion_user;

--
-- Name: tipo_material; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_material (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.tipo_material OWNER TO gestion_user;

--
-- Name: unidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unidad (
    id smallint NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.unidad OWNER TO gestion_user;

--
-- Name: material_historial id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_historial ALTER COLUMN id SET DEFAULT nextval('public.material_historial_id_seq'::regclass);


--
-- Data for Name: alumno; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alumno (id, matricula, password, nombre, apellidopaterno, apellidomaterno, unidad, division, licenciatura, estado, sancion, correoinstitucional, observaciones) FROM stdin;
2213064621	2213064621	1234	Brenda Abigail	Valdes	Crisanto	4	CNI	131	1	0	Abi@cua.uam.mx	Ninguna
2213064633	2213064633	Hola123	Walter	Montes	Montes	1	CNI	141	1	0	Walter@cua.uam.mx	
2213061323	2213061323	hola1234	Brenda	M	Crisanto	1	CNI	131	1	0	Jaz28@cua.uam.mx	
4525252626	4525252626	hola1234	PrueE	Ejemplo	Ejemplo	3	CNI	131	1	0	Ejemplo@cua.uam.mx	Ninguna
2213026701	2213026701	12345678	Diego	Reyez	Blancas	4	CNI	131	1	0	diego@cua.uam.mx	
\.


--
-- Data for Name: division; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.division (id, nombre) FROM stdin;
CNI	Ciencias Naturales e Ingeniería
CCD	Ciencias de la Comunicación y Diseño
CSH	Ciencias Sociales y Humanidades
\.


--
-- Data for Name: empleado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empleado (id, noeconomico, password, nombre, apellidopaterno, apellidomaterno, correoinstitucional, estado, tipo) FROM stdin;
50001	50001	1234	Raul	Salinas	Diaz	raul.salinas@cua.uam.mx	0	0
50004	50004	1234	Daniela	Nieto	Sierra	daniela.nieto@cua.uam.mx	0	0
50007	50007	1234	Javier	Torres	Delgado	javier.torres@cua.uam.mx	0	0
50011	50011	1234	Omar	Santos	Bravo	omar.santos@cua.uam.mx	0	0
50002	50002	1234	Lucia	Campos	Ramos	lucia.campos@cua.uam.mx	0	1
50003	50003	1234	Marco	Vazquez	Leal	marco.vazquez@cua.uam.mx	0	1
50006	50006	1234	Monica	Guerrero	Farias	monica.guerrero@cua.uam.mx	0	1
50009	50009	1234	Victor	Mejia	Alonso	victor.mejia@cua.uam.mx	0	1
50010	50010	1234	Alejandra	Ponce	Mora	alejandra.ponce@cua.uam.mx	0	1
50013	50013	1234	Erick	Navarro	Solis	erick.navarro@cua.uam.mx	0	1
50015	50015	1234	Alberto	Rios	Carrillo	alberto.rios@cua.uam.mx	0	1
50005	50005	1234	Pedro	Aguilar	Toledo	pedro.aguilar@cua.uam.mx	0	2
50008	50008	1234	Sandra	Cruz	Ortiz	sandra.cruz@cua.uam.mx	0	2
50012	50012	1234	Elena	Luna	Reynoso	elena.luna@cua.uam.mx	0	2
22830	228300	Hola1234	Brenda 2	Navarro	Crisanto	Abrenda@cua.uam.mx	0	1
21111	211117	Hola1234	Yatziri	Valdes	Crisanto	Yatziri@cua.uam.mx	0	1
22834	22832	Hola1234	Juan	Flores	Flores	juan@cua.uam.mx	0	1
50022	50028	Hola1234	Juan2	Santos	C	Juan2@cua.uam.mx	0	0
21128	21128	Hola1234	Luis2	Santos2	Crisanto2	Luis2@cua.uam.mx	0	1
99113	99113	hola1234	Brenda	Ab	Crisanto	abisss@cua.uam.mx	1	1
21830	21830	1234	Damian	Perez	Benitez	damian.perez@cua.uam.mx	0	1
\.


--
-- Data for Name: empleado_permiso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empleado_permiso (noeconomico, idpermiso) FROM stdin;
50001	2
50001	3
50001	1
50001	4
50001	0
50011	1
50011	0
21830	0
21830	1
21830	2
21830	3
21830	4
\.


--
-- Data for Name: estado_empleado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado_empleado (id, nombre) FROM stdin;
0	ACTIVO
1	SABATICO
2	BAJA
\.


--
-- Data for Name: licenciatura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.licenciatura (id, nombre) FROM stdin;
128	ADMINISTRACION
129	DERECHO
135	ESTUDIOS SOCIOTERRITORIALES
136	HUMANIDADES
130	DISEÑO
137	TECNOLOGÍAS Y SISTEMAS DE LA INFORMACIÓN
138	CIENCIAS DE LA COMUNICACIÓN
131	INGENIERÍA EN COMPUTACIÓN
132	MATEMATICAS APLICADAS
141	INGENIERÍA BIOLOGICA
144	BIOLOGÍA MOLECULAR
\.


--
-- Data for Name: material; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.material (id, inventario_uam, inventario_coordinacion, marca, modelo, numeroserie, estado, nombrematerial, cantidad, tipo, descripcion) FROM stdin;
MAT-LAB-000001	UAM-015	COORD-015	Razer	DeathAdder V2	100015	1	Mouse Gamer	0	0	Mouse con alta precisión
MAT-LAB-000027	UAM-027	COORD-027	Crucial	MX500 1TB	100027	1	Unidad SSD	0	0	SSD de alto rendimiento
MAT-LAB-000033	\N	COORD-033	Genérico	Cable Dupont	\N	0	Cable Dupont Macho-Macho	261	1	Cables para protoboard
MAT-LAB-000029	UAM-029	COORD-029	Gigabyte	AERO 15 OLED	100029	1	Computadora Portátil	0	0	Laptop para edición de video
MAT-LAB-000028	UAM-028	COORD-028	Intel	NUC 11 Performance	100028	0	Mini PC	1	0	Mini PC para estaciones reducidas
MAT-LAB-000031	\N	COORD-031	Genérico	220 Ohms	\N	0	Resistencia 220Ω	36	1	Resistencias electrónicas de 220 ohms
MAT-LAB-000017	UAM-017	COORD-017	SteelSeries	Apex Pro	100017	1	Teclado Mecánico	0	0	Teclado ajustable en presión de teclas
MAT-LAB-000020	UAM-020	COORD-020	TP-Link	Archer AX6000	100020	1	Router Inalámbrico	0	0	Router Wi-Fi 6 de alta velocidad
MAT-LAB-000015	UAM-015	COORD-015	Razer	DeathAdder V2	100015	3	Mouse Gamer	1	0	Mouse con alta precisión
\.


--
-- Data for Name: material_historial; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.material_historial (id, idmaterial, idprestamo, idempleado, tipo_evento, descripcion_evento, estado_anterior, estado_nuevo, fecha_evento, idtecnico) FROM stdin;
144	MAT-LAB-000031	LABPRES-21830-000001	21830	1	Préstamo asignado a empleado 50007	0	0	2026-04-06 19:21:42.425395	\N
145	MAT-LAB-000028	LABPRES-21830-000001	21830	1	Préstamo asignado a empleado 50007	3	1	2026-04-06 19:21:42.425395	\N
146	MAT-LAB-000015	LABPRES-21830-000001	21830	1	Préstamo asignado a empleado 50007	4	1	2026-04-06 19:21:42.425395	\N
147	MAT-LAB-000001	LABPRES-21830-000002	21830	1	Préstamo asignado a alumno 2213064621	2	1	2026-04-06 19:21:58.424279	\N
148	MAT-LAB-000027	LABPRES-21830-000003	21830	1	Préstamo asignado a alumno 2213064621	2	1	2026-04-06 19:23:59.694721	\N
149	MAT-LAB-000031	LABPRES-21830-000004	21830	1	Préstamo asignado a empleado 50010	0	0	2026-04-06 19:24:36.84099	\N
150	MAT-LAB-000033	LABPRES-21830-000005	21830	1	Préstamo asignado a empleado 50004	0	0	2026-04-06 19:27:20.262392	\N
151	MAT-LAB-000029	LABPRES-21830-000005	21830	1	Préstamo asignado a empleado 50004	0	1	2026-04-06 19:27:20.262392	\N
152	MAT-LAB-000031	LABPRES-21830-000006	21830	1	Préstamo asignado a alumno 2213026701	0	0	2026-04-06 19:27:42.561585	\N
153	MAT-LAB-000028	LABPRES-21830-000001	21830	2	Devolución sin incidencias	1	0	2026-04-06 21:22:29.095195	\N
154	MAT-LAB-000015	LABPRES-21830-000001	21830	5	Se rompió	1	2	2026-04-06 21:22:29.095195	\N
155	MAT-LAB-000031	LABPRES-21830-000001	21830	2	Devolución parcial (1/2)	0	0	2026-04-06 21:22:29.095195	\N
156	MAT-LAB-000031	LABPRES-21830-000006	21830	2	Devolución completa (1/1)	0	0	2026-04-08 21:16:29.308276	\N
157	MAT-LAB-000015	\N	21830	3	Se rompió	2	3	2026-04-08 21:19:10.075184	50010
\.


--
-- Data for Name: material_prestamo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.material_prestamo (idprestamo, idmaterial, cantidad) FROM stdin;
LABPRES-21830-000001	MAT-LAB-000031	2
LABPRES-21830-000001	MAT-LAB-000028	1
LABPRES-21830-000001	MAT-LAB-000015	1
LABPRES-21830-000002	MAT-LAB-000001	1
LABPRES-21830-000003	MAT-LAB-000027	1
LABPRES-21830-000004	MAT-LAB-000031	3
LABPRES-21830-000005	MAT-LAB-000033	1
LABPRES-21830-000005	MAT-LAB-000029	1
LABPRES-21830-000006	MAT-LAB-000031	1
\.


--
-- Data for Name: permisos_empleado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permisos_empleado (id, nombre) FROM stdin;
0	GESTOR MATERIALES
1	GESTOR USUARIOS
2	GESTOR SANCIONES
3	GESTOR PERMISOS
4	GESTOR PRESTAMOS
\.


--
-- Data for Name: prestamo; Type: TABLE DATA; Schema: public; Owner: aaeudd
--

COPY public.prestamo (id, solicitante_id, solicitante_tipo, idempleado, estadoprestamo, fechaprestamo, fechadevolucion, uea, grupo, observaciones, tipoprestamo, fechaentregado) FROM stdin;
LABPRES-21830-000002	2213064621	ALUMNO	21830	0	2026-04-07	2026-04-07	2928	A2M32		0	\N
LABPRES-21830-000003	2213064621	ALUMNO	21830	0	2026-04-07	2026-04-07	2928	A2M32		0	\N
LABPRES-21830-000004	50010	EMPLEADO	21830	0	2026-04-07	2026-04-07	2928382	A2M32		0	\N
LABPRES-21830-000005	50004	EMPLEADO	21830	0	2026-04-07	2026-04-07	2928382	A2M32		0	\N
LABPRES-21830-000001	50007	EMPLEADO	21830	1	2026-04-07	2026-04-07	2928382	A2M32	Mini PC: sin incidencias | Mouse Gamer: Se rompió | Resistencia 220Ω: devolución parcial (1/2)	0	2026-04-06
LABPRES-21830-000006	2213026701	ALUMNO	21830	1	2026-04-07	2026-04-07	2928382	A2M32	Resistencia 220Ω: devolución completa (1/1)	0	2026-04-08
\.


--
-- Data for Name: prestamo_backup; Type: TABLE DATA; Schema: public; Owner: aaeudd
--

COPY public.prestamo_backup (id, idalumno, idempleado, estadoprestamo, fechaprestamo, fechadevolucion, uea, grupo, observaciones, tipoprestamo, fechaentregado) FROM stdin;
LABPRES-21830-000001	2213064621	21830	1	2026-03-05	2026-03-05	2928382	A2M32	Resistencia 220Ω: devolución parcial (1/3) | Teclado Mecánico: No prende	0	2026-03-05
LABPRES-21830-000002	2213064621	21830	1	2026-03-05	2026-03-05	2928382	A2M32	Cable Dupont Macho-Macho: no se devolvió (0/2) | Mouse Gamer: No enciende	0	2026-03-05
LABPRES-21830-000003	2213064621	21830	1	2026-03-05	2026-03-05	2928382	A2M32	Router Inalámbrico: Se traba.	0	2026-03-05
LABPRES-21830-000004	2213061323	21830	1	2026-03-05	2026-03-05	2928382	A2M32	Teclado Mecánico: Roto	0	2026-03-05
LABPRES-21830-000005	2213064621	21830	1	2026-03-05	2026-03-05	2928382	A2M32	Mouse Gamer: Roto	0	2026-03-05
LABPRES-21830-000006	2213064621	21830	1	2026-03-05	2026-03-05	2928	A2M32	Router Inalámbrico: No se detecta.	0	2026-03-05
LABPRES-21830-000007	2213064621	21830	1	2026-03-05	2026-03-05	2928	A2M32	Mouse Gamer: Depronto no sirve.	0	2026-03-05
LABPRES-21830-000008	2213064621	21830	0	2026-03-05	2026-03-05	2928382	A2M32		0	\N
LABPRES-21830-000010	2213064621	21830	1	2026-03-06	2026-03-06	2928382	A2M32	Resistencia 220Ω: devolución parcial (90/192)	0	2026-03-05
LABPRES-21830-000011	2213064621	21830	1	2026-03-06	2026-03-15	2928382	A2M32	Unidad SSD: sin incidencias | Resistencia 220Ω: devolución parcial (2/3) | Cable Dupont Macho-Macho: devolución parcial (2/7) | Mini PC: No enciende.	1	2026-03-05
LABPRES-21830-000012	2213064633	21830	1	2026-03-06	2026-03-06	2928382	A2M32	Resistencia 220Ω: devolución parcial (40/89) | Mouse Gamer: Se apaga cada 5 minutos.	0	2026-03-05
LABPRES-21830-000013	2213064621	21830	1	2026-03-06	2026-03-06	2928382	A2M32	Mouse Gamer: No prende. | Unidad SSD: No se detecta. | Cable Dupont Macho-Macho: devolución parcial (30/50)	0	2026-03-16
LABPRES-21830-000009	2213064621	21830	1	2026-03-05	2026-03-05	2928	A2M32	Cable Dupont Macho-Macho: devolución parcial (4/5)	0	2026-03-19
\.


--
-- Data for Name: tipo_empleado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_empleado (id, nombre) FROM stdin;
0	COORDINADOR
1	TECNICO
2	PROFESOR
\.


--
-- Data for Name: tipo_material; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_material (id, nombre) FROM stdin;
0	INVENTARIADO
1	CONSUMIBLE
\.


--
-- Data for Name: unidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unidad (id, nombre) FROM stdin;
1	AZCAPOTZALCO
2	IZTAPALAPA
3	XOCHIMILCO
4	CUAJIMALPA
5	LERMA
\.


--
-- Name: material_historial_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.material_historial_id_seq', 157, true);


--
-- Name: sancion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sancion_id_seq', 1, false);


--
-- Name: alumno alumno_correoinstitucional_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno
    ADD CONSTRAINT alumno_correoinstitucional_key UNIQUE (correoinstitucional);


--
-- Name: alumno alumno_matricula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno
    ADD CONSTRAINT alumno_matricula_key UNIQUE (matricula);


--
-- Name: alumno alumno_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno
    ADD CONSTRAINT alumno_pkey PRIMARY KEY (id);


--
-- Name: division division_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.division
    ADD CONSTRAINT division_pkey PRIMARY KEY (id);


--
-- Name: empleado empleado_correoinstitucional_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleado
    ADD CONSTRAINT empleado_correoinstitucional_key UNIQUE (correoinstitucional);


--
-- Name: empleado empleado_noeconomico_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleado
    ADD CONSTRAINT empleado_noeconomico_key UNIQUE (noeconomico);


--
-- Name: empleado_permiso empleado_permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleado_permiso
    ADD CONSTRAINT empleado_permiso_pkey PRIMARY KEY (noeconomico, idpermiso);


--
-- Name: empleado empleado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleado
    ADD CONSTRAINT empleado_pkey PRIMARY KEY (id);


--
-- Name: estado_empleado estado_empleado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_empleado
    ADD CONSTRAINT estado_empleado_pkey PRIMARY KEY (id);


--
-- Name: licenciatura licenciatura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.licenciatura
    ADD CONSTRAINT licenciatura_pkey PRIMARY KEY (id);


--
-- Name: material_historial material_historial_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_historial
    ADD CONSTRAINT material_historial_pkey PRIMARY KEY (id);


--
-- Name: material material_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_pkey PRIMARY KEY (id);


--
-- Name: material_prestamo material_prestamo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_prestamo
    ADD CONSTRAINT material_prestamo_pkey PRIMARY KEY (idprestamo, idmaterial);


--
-- Name: permisos_empleado permisos_empleado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos_empleado
    ADD CONSTRAINT permisos_empleado_pkey PRIMARY KEY (id);


--
-- Name: prestamo prestamo_pkey; Type: CONSTRAINT; Schema: public; Owner: aaeudd
--

ALTER TABLE ONLY public.prestamo
    ADD CONSTRAINT prestamo_pkey PRIMARY KEY (id);


--
-- Name: tipo_empleado tipo_empleado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_empleado
    ADD CONSTRAINT tipo_empleado_pkey PRIMARY KEY (id);


--
-- Name: tipo_material tipo_material_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_material
    ADD CONSTRAINT tipo_material_pkey PRIMARY KEY (id);


--
-- Name: unidad unidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unidad
    ADD CONSTRAINT unidad_pkey PRIMARY KEY (id);


--
-- Name: alumno alumno_division_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno
    ADD CONSTRAINT alumno_division_fkey FOREIGN KEY (division) REFERENCES public.division(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: alumno alumno_licenciatura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno
    ADD CONSTRAINT alumno_licenciatura_fkey FOREIGN KEY (licenciatura) REFERENCES public.licenciatura(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: alumno alumno_unidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno
    ADD CONSTRAINT alumno_unidad_fkey FOREIGN KEY (unidad) REFERENCES public.unidad(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: empleado empleado_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleado
    ADD CONSTRAINT empleado_estado_fkey FOREIGN KEY (estado) REFERENCES public.estado_empleado(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: empleado_permiso empleado_permiso_idpermiso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleado_permiso
    ADD CONSTRAINT empleado_permiso_idpermiso_fkey FOREIGN KEY (idpermiso) REFERENCES public.permisos_empleado(id);


--
-- Name: empleado_permiso empleado_permiso_noeconomico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleado_permiso
    ADD CONSTRAINT empleado_permiso_noeconomico_fkey FOREIGN KEY (noeconomico) REFERENCES public.empleado(noeconomico);


--
-- Name: empleado empleado_tipo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleado
    ADD CONSTRAINT empleado_tipo_fkey FOREIGN KEY (tipo) REFERENCES public.tipo_empleado(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: material_historial fk_material_historial_empleado; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_historial
    ADD CONSTRAINT fk_material_historial_empleado FOREIGN KEY (idempleado) REFERENCES public.empleado(id);


--
-- Name: material_historial fk_material_historial_material; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_historial
    ADD CONSTRAINT fk_material_historial_material FOREIGN KEY (idmaterial) REFERENCES public.material(id);


--
-- Name: material_historial fk_material_historial_prestamo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_historial
    ADD CONSTRAINT fk_material_historial_prestamo FOREIGN KEY (idprestamo) REFERENCES public.prestamo(id);


--
-- Name: material_historial fk_material_historial_tecnico; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_historial
    ADD CONSTRAINT fk_material_historial_tecnico FOREIGN KEY (idtecnico) REFERENCES public.empleado(id);


--
-- Name: material_prestamo material_prestamo_idmaterial_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_prestamo
    ADD CONSTRAINT material_prestamo_idmaterial_fkey FOREIGN KEY (idmaterial) REFERENCES public.material(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: material_prestamo material_prestamo_idprestamo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_prestamo
    ADD CONSTRAINT material_prestamo_idprestamo_fkey FOREIGN KEY (idprestamo) REFERENCES public.prestamo(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: material material_tipo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_tipo_fkey FOREIGN KEY (tipo) REFERENCES public.tipo_material(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: prestamo prestamo_idempleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aaeudd
--

ALTER TABLE ONLY public.prestamo
    ADD CONSTRAINT prestamo_idempleado_fkey FOREIGN KEY (idempleado) REFERENCES public.empleado(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 270CzJ5Xu1oM7hJnPil1XQMnOQh6fgBQJtnbbNyKOeuaeWPMZNWdd7YDImOJ6zg

