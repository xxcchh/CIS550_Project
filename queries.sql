Q1
  What is the difference of performance between men and women for each country?


WITH Fcount AS(
  SELECT C.code, COUNT(DISTINCT hE.EID) AS Female_gold_medals
  FROM Country C INNER JOIN Represents R ON C.code = R.code
                 INNER JOIN Athletes A ON R.aid = A.aid
                 INNER JOIN PerformanceOfAthletes POA ON A.aid = POA.aid
                 INNER JOIN hasEvents hE ON POA.eid = hE.eid
                 INNER JOIN hasDiscipline hD ON hE.dname = hD.dname AND hE.year = hD.year
                 INNER JOIN Olympics O ON hD.year = O.year
  WHERE O.year = 2008 AND A.gender = 'Women' AND POA.medal = 'Gold'
  GROUP BY C.code
), 


Mcount AS(
  SELECT C.code, COUNT(DISTINCT hE.EID) AS Male_gold_medals
  FROM Country C INNER JOIN Represents R ON C.code = R.code
                 INNER JOIN Athletes A ON R.aid = A.aid
                 INNER JOIN PerformanceOfAthletes POA ON A.aid = POA.aid
                 INNER JOIN hasEvents hE ON POA.eid = hE.eid
                 INNER JOIN hasDiscipline hD ON hE.dname = hD.dname AND hE.year = hD.year
                 INNER JOIN Olympics O ON hD.year = O.year
  WHERE O.year = 2008 AND A.gender = 'Men' AND POA.medal = 'Gold'
  GROUP BY C.code
)


SELECT *
FROM Fcount F INNER JOIN Mcount M ON F.code = M.code;


Q2. con�t 
By clicking the name of each country (var = ccode), show country page.
SELECT * 
FROM Country 
WHERE country.code = var


By clicking the  the medal number of each country (var1 = gender, var2=ccode), show events
SELECT A.name, hE.year, hE.DNAME, hE.ENAME, POA.Medal
FROM Country C INNER JOIN Represents R ON C.code = R.code
                 INNER JOIN Athletes A ON R.aid = A.aid
                 INNER JOIN PerformanceOfAthletes POA ON A.aid = POA.aid
                 INNER JOIN hasEvents hE ON POA.eid = hE.eid
                 INNER JOIN hasDiscipline hD ON hE.dname = hD.dname AND hE.year = hD.year
                 INNER JOIN Olympics O ON hD.year = O.year
WHERE O.year = 2008 AND A.gender = var1 AND POA.medal = 'Gold' AND C.code = var2;


Q3
What is the economic impact of hosting the Olympic Games?
WITH CPERFORMANCE AS(
SELECT code, year, (num_of_gold + num_of_silver + num_of_bronze) as totalmedals 
FROM PERFORMANCEOFCOUNTRIES
ORDER BY code, year)


SELECT c.NAME, e.YEAR, e.GDP, e.CPI, e.POPULATION, e.INCOME, p.TOTALMEDALS 
FROM ECONOMICS e, COUNTRY c, CPERFORMANCE p
WHERE e.CODE = c.CODE AND e.CODE = p.CODE AND e.YEAR = p.YEAR
ORDER BY e.CODE, e.YEAR;




Q4
Top ten athletes win the most medals
  
WITH TEMP AS (SELECT aid, COUNT(medal) AS total_medals
  FROM PERFORMANCEOFATHLETES
  GROUP BY aid
  ORDER BY total_medals DESC)
  SELECT A.name, T.total_medals
  FROM TEMP T, Athletes A
  WHERE T.aid = A.aid AND ROWNUM <=10


By clicking the name of each athlete, show athlete profile
SELECT A.name, A.DOB, A.gender, C.name as Country
FROM Athletes A, Represents R, Country C
WHERE A.aid = R.aid AND C.code = R.code AND A.name = var

We can also have top N athletes

WITH TEMP AS (SELECT aid, COUNT(medal) AS total_medals
  FROM PERFORMANCEOFATHLETES
  GROUP BY aid
  ORDER BY total_medals DESC)
  SELECT A.name, T.total_medals
  FROM TEMP T, Athletes A
  WHERE T.aid = A.aid AND ROWNUM <= N

Q5
Total medals of every country from most to least


SELECT C.name, SUM(P.TOTALMEDALS) as total
FROM CPerformance P, Country C 
WHERE P.code = C.code
GROUP BY C.name
ORDER BY total DESC


By clicking the name of each country (var = ccode), show economics
SELECT * 
FROM Economics 
WHERE Economics.code = var


Q6
What is the maximum record for a given event

WITH TEMP1 AS (SELECT H1.eid, MAX(H1.record) AS MAXRECORD
FROM hasEvents H1 
GROUP BY H1.eid)
SELECT H.dname AS Discipline, H.ename AS Event, H.record, H.year
FROM hasEvents H, TEMP1 T
WHERE H.eid = T.MAXRECORD 

Q7 
Show 2016 top 10 

SELECT *
FROM 
(SELECT * 
FROM performanceofcountries
WHERE year = 2008 
ORDER BY num_of_gold DESC)
WHERE ROWNUM <= 10

SELECT * 
FROM performanceofcountries
WHERE year = 2008 
ORDER BY num_of_gold DESC



