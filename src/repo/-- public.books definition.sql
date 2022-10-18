-- public.books definition

-- Drop table

-- DROP TABLE public.books;

CREATE TABLE public.books (
	id serial4 NOT NULL,
	title varchar NOT NULL,
	author varchar NOT NULL,
	published_date date NOT NULL,
	publisher varchar NOT NULL,
	genre varchar NULL,
	CONSTRAINT pk_db1 PRIMARY KEY (id)
);


-- public.list_borrow definition

-- Drop table

-- DROP TABLE public.list_borrow;

CREATE TABLE public.list_borrow (
	id serial4 NOT NULL,
	book_id int4 NOT NULL,
	user_id int4 NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	duration int4 NOT NULL,
	CONSTRAINT pk_list_borrow PRIMARY KEY (id)
);


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id serial4 NOT NULL,
	name varchar NOT NULL,
	email varchar NOT NULL,
	"password" varchar NOT NULL,
	CONSTRAINT pk_users PRIMARY KEY (id)
);