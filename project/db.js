/**
 * Created by chen on 11/20/16.
 */
var oracledb = require('oracledb');
// Connection data
var connectData = {
    user          : "cis550project",
    password      : "zwdkxchcc",
    connectString : "olympics2020.co8dwthdt6zb.us-east-1.rds.amazonaws.com:1521/OLYMPICS"
    };

// oracledb.createPool(
//     connectData,
//     function (err, pool) {
//         console.log(pool.poolAlias);
//     }
// );

// Q1 What is the difference of performance between men and women for each country?
// [ [ 'AFG', 1960, 537777811.911, 8994793, 0, 0 ],
//     [ 'AFG', 1964, 800000045.511, 9728645, 0, 0 ],
    function getMenAndWomenPerform(callback) {
    console.log('getMenAndWomenPerform');
    oracledb.getConnection(
        connectData,
        function(err, connection)
        {
            if (err) {
                console.error(err.message);
                callback(err, null);
            }else{
                connection.execute(
                    "        WITH Fcount AS(" +
                    "        SELECT C.code, COUNT(DISTINCT hE.EID) AS Female_gold_medals" +
                    "        FROM Country C INNER JOIN Represents R ON C.code = R.code" +
                    "        INNER JOIN Athletes A ON R.aid = A.aid" +
                    "        INNER JOIN PerformanceOfAthletes POA ON A.aid = POA.aid" +
                    "        INNER JOIN hasEvents hE ON POA.eid = hE.eid" +
                    "        INNER JOIN hasDiscipline hD ON hE.dname = hD.dname AND hE.year = hD.year" +
                    "        INNER JOIN Olympics O ON hD.year = O.year" +
                    "        WHERE O.year = 2008 AND A.gender = 'Women' AND POA.medal = 'Gold'" +
                    "        GROUP BY C.code" +
                    "        )," +
                    "        Mcount AS(" +
                    "        SELECT C.code, COUNT(DISTINCT hE.EID) AS Male_gold_medals" +
                    "        FROM Country C INNER JOIN Represents R ON C.code = R.code " +
                    "        INNER JOIN Athletes A ON R.aid = A.aid" +
                    "        INNER JOIN PerformanceOfAthletes POA ON A.aid = POA.aid" +
                    "        INNER JOIN hasEvents hE ON POA.eid = hE.eid" +
                    "        INNER JOIN hasDiscipline hD ON hE.dname = hD.dname AND hE.year = hD.year" +
                    "        INNER JOIN Olympics O ON hD.year = O.year" +
                    "        WHERE O.year = 2008 AND A.gender = 'Men' AND POA.medal = 'Gold'" +
                    "        GROUP BY C.code" +
                    "        )" +
                    "        SELECT *" +
                    "        FROM Fcount F INNER JOIN Mcount M ON F.code = M.code",
                    function(err, result)
                    {
                        if (err) {
                            console.error(err.message);
                            callback(err, null);
                        }else{
                            connection.close();
                            // console.log(result.rows);
                            callback(null, result.rows);
                        }
                    });
            }
        });
    }


// Q2. cont By clicking the name of each country (var = ccode), show country page.
// [ [ 'USA', 'United States', 0, 0, 0, 0 ] ]
function getCountry(ccode, callback) {
    console.log('getCountry' + ccode);
    oracledb.getConnection(
        connectData,
        function(err, connection)
        {
            if (err) {
                console.error(err.message);
                callback(err, null);
            }else{
                connection.execute(
                    "            SELECT * " +
                    "            FROM Country" +
                    "            WHERE country.code = '" + ccode + "'",
                    function(err, result)
                    {
                        if (err) {
                            console.error(err.message);
                            callback(err, null);
                        }else{
                            connection.close();
                            console.log(result.rows);
                            callback(null, result.rows);
                        }
                    });
            }
        });
}
// // By clicking the  the medal number of each country (var1 = gender, var2=ccode), show events
function getEvents(gender, ccode, callback) {
    console.log('getEvents' + 'country' + ccode + 'gender' + gender);
    oracledb.getConnection(
        connectData,
        function(err, connection)
        {
            if (err) {
                console.error(err.message);
                callback(err, null);
            }
            connection.execute(
                "        SELECT A.name, hE.year, hE.DNAME, hE.ENAME, POA.Medal" +
                "        FROM Country C INNER JOIN Represents R ON C.code = R.code" +
                "        INNER JOIN Athletes A ON R.aid = A.aid" +
                "        INNER JOIN PerformanceOfAthletes POA ON A.aid = POA.aid" +
                "        INNER JOIN hasEvents hE ON POA.eid = hE.eid" +
                "        INNER JOIN hasDiscipline hD ON hE.dname = hD.dname AND hE.year = hD.year" +
                "        INNER JOIN Olympics O ON hD.year = O.year" +
                "        WHERE O.year = 2008 AND A.gender = 'Men' AND POA.medal = 'Gold' AND C.code = 'USA'",
                function(err, result)
                {
                    if (err) {
                        console.error(err.message);
                        callback(err, null);
                    }else{
                        connection.close();
                        console.log(result.rows);
                        callback(null, result.rows);
                    }
                });
        });
}


// Q3 What is the economic impact of hosting the Olympic Games?
function getEconomicsOfHost(callback) {
    console.log('getEconomicsOfHost'),
    oracledb.getConnection(
    connectData,
    function(err, connection)
    {
        if (err) {
            console.error(err.message);
            callback(err, null);
        }
        connection.execute(
        "        WITH CPERFORMANCE AS(" +
        "        SELECT code, year, (num_of_gold + num_of_silver + num_of_bronze) as totalmedals" +
        "        FROM PERFORMANCEOFCOUNTRIES" +
        "        ORDER BY code, year)" +
        "        SELECT c.NAME, e.YEAR, e.GDP, e.CPI, e.POPULATION, e.INCOME, p.TOTALMEDALS" +
        "        FROM ECONOMICS e, COUNTRY c, CPERFORMANCE p" +
        "        WHERE e.CODE = c.CODE AND e.CODE = p.CODE AND e.YEAR = p.YEAR" +
        "        ORDER BY e.CODE, e.YEAR",
        function(err, result)
        {
            if (err) {
                console.error(err.message);
                callback(err, null);
            }else{
                connection.close();
                console.log(result.rows);
                callback(null, result.rows);
            }
        });
    });
}

// Q4 Top n athletes win the most medals
// [ [ 'LATYNINA, Larisa', 18 ],
//     [ 'PHELPS, Michael', 16 ],
function getTopNAthletes(N = 10, callback) {
    console.log('getTopNAthletes' + N),
    oracledb.getConnection(
        connectData,
        function(err, connection)
        {
            if (err) {
                console.error(err.message);
                callback(err, null);
            }
            connection.execute(
                "        WITH TEMP AS (SELECT aid, COUNT(medal) AS total_medals" +
                "        FROM PERFORMANCEOFATHLETES" +
                "        GROUP BY aid" +
                "        ORDER BY total_medals DESC)" +
                "        SELECT A.name, T.total_medals" +
                "        FROM TEMP T, Athletes A" +
                "        WHERE T.aid = A.aid AND ROWNUM <= " + N,
            function(err, result)
            {
                if (err) {
                    console.error(err.message);
                    callback(err, null);
                }else{
                    connection.close();
                    console.log(result.rows);
                    callback(null, result.rows);
                }
            });
        });
}
// // By clicking the name of each athlete, show athlete profile
function showAthleteProfile(name, callback) {
    console.log('showAthleteProfile' + name),
    oracledb.getConnection(
        connectData,
        function(err, connection)
        {
            if (err) {
                console.error(err.message);
                callback(err, null);
            }
            connection.execute(
                "        SELECT A.name, A.DOB, A.gender, C.name as Country" +
                "        FROM Athletes A, Represents R, Country C" +
                "        WHERE A.aid = R.aid AND C.code = R.code AND A.name = '" + name + "'",
                function(err, result)
                {
                    if (err) {
                        console.error(err.message);
                        callback(err, null);
                    }else{
                        connection.close();
                        console.log(result.rows);
                        callback(null, result.rows);
                    }
                });
        });
}

// Q5 Total medals of every country from most to least
function getTopMedalsOfCountry(callback) {
    console.log('getTopMedalsOfCountry');
    oracledb.getConnection(
    connectData,
    function(err, connection)
    {
        if (err) {
            console.error(err.message);
            return;
        }
        connection.execute(
            "     SELECT C.name, SUM(P.TOTALMEDALS) as total" +
            "     FROM CPerformance P, Country C" +
            "     WHERE P.code = C.code" +
            "     GROUP BY C.name" +
            "     ORDER BY total DESC",
        function(err, result)
            {
                if (err) {
                    console.error(err.message);
                    return;
                }
                console.log(result.rows);
            });
});
}

// By clicking the name of each country (var = ccode), show economics
// Get the economics about a country
function getEconomics(code, calllback){
    console.log('getEconomics' + code);
    oracledb.getConnection(
        connectData,
        function(err, connection)
        {
            if (err) {
                console.error(err.message);
                return;
            }
            connection.execute(
                "     SELECT *" +
                "     FROM Economics" +
                "     WHERE Economics.code = '" + code + "'",
                function(err, result)
                {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    console.log(result.rows);
                });
        });
}


// Q6 What is the maximum record for a given event
function getMaxRecordOfEvent(ename, callback) {
    console.log('getMaxRecordOfEvent' + ename);
    oracledb.getConnection(
        connectData,
        function(err, connection)
        {
            if (err) {
                console.error(err.message);
                return;
            }
            connection.execute(
                "    WITH TEMP1 AS (SELECT H1.eid, MAX(H1.record) AS MAXRECORD" +
                "    FROM hasEvents H1" +
                "    GROUP BY H1.eid)" +
                "    SELECT H.dname AS Discipline, H.ename AS Event, H.record, H.year" +
                "    FROM hasEvents H, TEMP1 T" +
                "    WHERE H.eid = T.MAXRECORD",
                function(err, result)
                {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    console.log(result.rows);
                });
        });
}


// oracledb.getConnection(
//     connectData,
//     function(err, connection)
//     {
//         if (err) {
//             console.error(err.message);
//             return;
//         }
//         connection.execute(
//             "    WITH TEMP1 AS (SELECT H1.eid, MAX(H1.record) AS MAXRECORD" +
//             "    FROM hasEvents H1" +
//             "    GROUP BY H1.eid)" +
//             "    SELECT H.dname AS Discipline, H.ename AS Event, H.record, H.year" +
//             "    FROM hasEvents H, TEMP1 T" +
//             "    WHERE H.eid = T.MAXRECORD",
//         function(err, result)
//             {
//                 if (err) {
//                     console.error(err.message);
//                     return;
//                 }
//                 console.log(result.rows);
//             });
// });

