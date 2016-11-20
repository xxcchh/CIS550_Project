-- Q2
-- What¡¯s the difference of performance between men and women for each country?
WITH Fcount AS(
  SELECT C.code, COUNT(DISTINCT eid) AS Female_gold_medals
  FROM Country C INNER JOIN Represents R ON C.code = R.code
                 INNER JOIN Athletes A ON R.aid = A.aid
                 INNER JOIN PerformanceOfAthletes POA ON A.aid = POA.aid
                 INNER JOIN hasEvents hE ON POA.eid = hE.eid
                 INNER JOIN hasDiscipline hD ON hE.dname = hD.dname AND hE.year = hD.year
                 INNER JOIN Olympics O ON hD.year = O.year
  WHERE O.year = "2008" AND A.gender = "Women" AND POA.medal = "gold"
  GROUP BY C.code
)

WITH Mcount AS(
  SELECT C.code, COUNT(DISTINCE eid) AS Male_gold_medals
  FROM Country C INNER JOIN Respresents R ON C.code = R.code
                 INNER JOIN Athletes A ON R.aid = A.aid
                 INNER JOIN PerformanceOfAthletes POA ON A.aid = POA.aid
                 INNER JOIN hasEvents hE ON POA.eid = hE.eid
                 INNER JOIN hasDiscipline hD ON hE.dname = hD.dname AND hE.year = hD.year
                 INNER JOIN Olympics O ON hD.year = O.year
  WHERE O.year = "2008" AND A.gender = "Men" AND POA.medal = "gold"
  GROUP BY C.code
)

SELECT *
FROM Fcount F INNER JOIN Mcount M ON F.code = M.code;

-- Q3
-- What is the economic impact of hosting the Olympic Games?
CREATE VIEW CPerformance AS
SELECT code, year, num_of_gold + num_of_silver + num_of_bronze as totalmedals FROM PERFORMANCEOFCOUNTRIES
ORDER BY code, year;
SELECT c.NAME, e.YEAR, e.GDP, e.CPI, e.POPULATION, e.INCOME, p.TOTALMEDALS FROM ECONOMICS e, COUNTRY c, CPERFORMANCE p
WHERE e.CODE = c.CODE AND e.CODE = p.CODE AND e.YEAR = p.YEAR
ORDER BY e.CODE, e.YEAR;

-- Q4
-- Top ten athletes win the most medals
SELECT aid, SUM(medal) AS total FROM PERFORMANCEOFATHLETES GROUP BY aid
HAVING COUNT(*) <= 10
ORDER BY total DESC;

-- Q5
-- Total medals of every country from most to least
SELECT code, SUM(TOTALMEDALS) AS total FROM CPerformance GROUP BY code
ORDER BY total DESC;

-- Q6
-- (Maximum record, Year) for a given event
SELECT H.ename, H.record, H.year, H.event_gender FROM has_Events H
WHERE H.record IN (SELECT H1.year, MAX(H1.record)
FROM has_Events H1 GROUP BY H1.year)