CREATE TABLE Country(
	code CHAR(3),
	name VARCHAR(50),
	GDP FLOAT,
	population FLOAT,
	income FLOAT,
	CPI FLOAT,
	pred_rank INTEGER,
	pred_gold INTEGER,
	pred_silver INTEGER,
	pred_bronze INTEGER,
	PRIMARY KEY (code)
);

CREATE TABLE Olympics(
	year YEAR,
	location VARCHAR(50), 
	PRIMARY KEY (year)
);

CREATE TABLE PerformanceOfCountries(
	code CHAR(3),
	year YEAR,
	rank INTEGER,
	num_of_gold INTEGER,
	num_of_silver INTEGER,
	num_of_bronze INTEGER,
	PRIMARY KEY (code, year),
	FOREIGN KEY (code) REFERENCES Country,
	FOREIGN KEY (year) REFERENCES Olympics
);

CREATE TABLE hasDiscipline(
	year YEAR,
	dname VARCHAR(50), 
	PRIMARY KEY (year, dname), 
	FOREIGN KEY (year) REFERENCES Olympics
);

CREATE TABLE hasEvents(
	year YEAR,
	dname VARCHAR(50),
	eid INTEGER,
	ename VARCHAR(50),
	event_gender VARCHAR(1),
	record FLOAT,
	PRIMARY KEY (year, dname, eid),
	FOREIGN KEY (year) REFERENCES Olympics,
	FOREIGN KEY (dname) REFERENCES hasDiscipline,
);

CREATE TABLE Athletes(
	aid INTEGER,
	name VARCHAR(255),
	DOB DATE,
	gender VARCHAR(5),
	height FLOAT,
	weight FLOAT,
	PRIMARY KEY (aid)
);

CREATE TABLE PerformanceOfAthletes(
	year YEAR,
	aid INTEGER,
	medal VARCHAR(6),
	eid INTEGER,
	dname VARCHAR(50),
	PRIMARY KEY (aid, dname, eid, year),
	FOREIGN KEY (aid) REFERENCES Athletes,
	FOREIGN KEY (eid) REFERENCES hasEvents,
	FOREIGN KEY (dname) REFERENCES hasDiscipline,
	FOREIGN KEY (year) REFERENCES Olympics,
	CHECK ( medal IN ('gold', 'silver', 'bronze') )
);

CREATE TABLE Represents(
	aid INTEGER,
	code CHAR(3),
	PRIMARY KEY (aid, code),
	FOREIGN KEY (aid) REFERENCES Athletes,
	FOREIGN KEY (code) REFERENCES Country
);

#Remarks:
#1. do we need to separate location into city and host?
#2. how to remove the year attribute from PredictionIn2020 table.
#3. event name and event ID can be merged together?