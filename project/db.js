/**
 * Created by chen on 11/20/16.
 */
var oracledb = require('oracledb');
var google = require('google');
var open = require('open');

// Connection data
var connectData = {
    user          : "cis550project",
    password      : "zwdkxchcc",
    connectString : "olympics2020.co8dwthdt6zb.us-east-1.rds.amazonaws.com:1521/OLYMPICS"
};


/*dynamodb modelu */
var AWS = require("aws-sdk");
AWS.config.update({
    accessKeyId: 'AKIAI5UILHT4HFUW2WMQ',
    secretAccessKey: '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',
    region: 'us-east-1'
});
var docClient = new AWS.DynamoDB.DocumentClient();

//show top ten swimmers in the history
//output: firstname + lastname
var getAllAthlete = function(callback){
    console.log('getAllAthlete');
    var params = {
        TableName : "Athlete"
    };

        docClient.scan(params, function(err, data) {
        if (err || data.Items.length == 0){
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            callback(err, null);
        }
        else {
            console.log("Query succeeded.");
            var items = [];
            for (var i = 0; i < data.Items.length; i++) {
                items.push(data.Items[i]);
            }
            callback(null, items);
        }
    });
};

//show the full profile for a certain swimmer
//key: the _id of the swimmer
var getProfile = function(key, callback){

    var params = {
        TableName : "Athlete",
        FilterExpression: "#id = :val",
        ExpressionAttributeNames: {
            "#id":"_id"
        },
        ExpressionAttributeValues: {
            ":val":key
        }
    };

        docClient.scan(params, function(err, data) {
        if (err || data.Items.length == 0){
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            callback(err, null);
        }
        else {
            console.log("Query succeeded.");
            var items = [];
            for (var i = 0; i < data.Items.length; i++) {
                items.push(data.Items[i]);
                console.log(" -" +data.Items[i].Sex);
            }
            callback(null, data);
        }
    });
};


// Q1 What is the difference of performance between men and women for each country?
// [ [ 'AFG', 1960, 537777811.911, 8994793, 0, 0 ],
//     [ 'AFG', 1964, 800000045.511, 9728645, 0, 0 ],
var getMenAndWomenPerform = function (callback) {
    var oracledb = require('oracledb');
// Connection data
    var connectData = {
        user          : "cis550project",
        password      : "zwdkxchcc",
        connectString : "olympics2020.co8dwthdt6zb.us-east-1.rds.amazonaws.com:1521/OLYMPICS"
    };

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
                    "        SELECT C.code, C.name, COUNT(DISTINCT hE.EID) AS Female_gold_medals" +
                    "        FROM Country C INNER JOIN Represents R ON C.code = R.code" +
                    "        INNER JOIN Athletes A ON R.aid = A.aid" +
                    "        INNER JOIN PerformanceOfAthletes POA ON A.aid = POA.aid" +
                    "        INNER JOIN hasEvents hE ON POA.eid = hE.eid" +
                    "        INNER JOIN hasDiscipline hD ON hE.dname = hD.dname AND hE.year = hD.year" +
                    "        INNER JOIN Olympics O ON hD.year = O.year" +
                    "        WHERE O.year = 2008 AND A.gender = 'Women' AND POA.medal = 'Gold'" +
                    "        GROUP BY C.code, C.name" +
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
                    "        SELECT F.name, F.code,Female_gold_medals,Male_gold_medals" +
                    "        FROM Fcount F INNER JOIN Mcount M ON F.code = M.code" +
                    "        ORDER BY F.name, Female_gold_medals, Male_gold_medals",
                    function(err, result)
                    {
                        if (err) {
                            console.error(err.message);
                            callback(err, null);
                        }else{
                            // connection.close();
                            console.log(result.rows);
                            callback(null, result.rows);
                            // connection.close();
                        }
                    });
            }
            connection.close();
        });
};

// Q2. cont By clicking the name of each country (var = ccode), show country page.
// [ [ 'USA', 'United States', 0, 0, 0, 0 ] ]
var getCountry = function (ccode, callback) {
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
};

var getAllCountry = function (callback) {
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
                    "            FROM Country",
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
};

// // By clicking the  the medal number of each country (var1 = gender, var2=ccode), show events
var getEvents = function (gender, ccode, callback) {
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
};


// Q3 What is the economic impact of hosting the Olympic Games?
var getEconomicsOfHost = function (callback) {
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
                    "        FROM ECONOMICS e, COUNTRY c, CPERFORMANCE p, OLYMPICS o" +
                    "        WHERE e.CODE = c.CODE AND e.CODE = p.CODE AND e.YEAR = p.YEAR AND o.country = c.CODE AND o.year = e.year" +
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
};

// Q4 Top n athletes win the most medals
// [ [ 'LATYNINA, Larisa', 18 ],
//     [ 'PHELPS, Michael', 16 ],
var getTopNAthletes = function (N, callback) {
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
};
// // By clicking the name of each athlete, show athlete profile
var showAthleteProfile = function (callback) {
    console.log('showAthleteProfile'),
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
                    "        WHERE A.aid = R.aid AND C.code = R.code",
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
};

// Q5 Total medals of every country from most to least
var getTopMedalsOfCountry = function (callback) {
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
                    }else{
                        connection.close();
                        console.log(result.rows);
                        callback(null, result.rows);
                    }
                    // console.log(result.rows);
                });
        });
};


// By clicking the name of each country (var = ccode), show economics
// Get the economics about a country
var getEconomics = function (code, calllback){
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
};


// Q6 What is the maximum record for a given event
var getMaxRecordOfEvent = function (ename, callback) {
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
};
// Q7 show 2016 top 10 records
var getShowOnHomePage = function(callback){
    console.log("show 2016 records");
    oracledb.getConnection(
        connectData, 
        function(err, connection)
        {
            if (err){
                console.log(err.message);
                return;
            }
            connection.execute(
            "   SELECT code, num_of_gold, num_of_silver, num_of_bronze" +
            "   FROM (" + 
            "   SELECT *" +
            "   FROM performanceofcountries"+
            "   WHERE year = 2016 "+
            "   ORDER BY num_of_gold DESC )" + 
            "   WHERE ROWNUM <= 10",
            function(err, result)
            {
                if (err){
                    console.log(err.message);
                    return;
                }
                callback(null, result.rows);
            }
        )
    }
)
};

var googleSearch = function(text, callback) {
    // var text = req.s;
    google.resultsPerPage = 5;
    google(text, function (err, res){
        if (err) {
            console.error(err);
        }
        else{
            var link = res.links[1];
            console.log(link.title + ' - ' + link.href);
            console.log(link.description + "\n");
            open(link.href);
            callback(null, link);
        }
    });
};


var recordofevents = function (callback) {
    var oracledb = require('oracledb');
// Connection data
    var connectData = {
        user          : "cis550project",
        password      : "zwdkxchcc",
        connectString : "olympics2020.co8dwthdt6zb.us-east-1.rds.amazonaws.com:1521/OLYMPICS"
    };
    console.log('recordofevents');
    oracledb.getConnection(
        connectData,
        function(err, connection)
        {
            if (err) {
                console.error(err.message);
                callback(err, null);
            }else{
                connection.execute(
                    "   SELECT DISTINCT H.dname, H.ename, C.name, A.name, H.year, P.medal" +
                    "   FROM ATHLETES A, REPRESENTS R, PERFORMANCEOFATHLETES P, HASEVENTS H, COUNTRY C" +
                    "   WHERE r.aid = a.aid and a.aid= p.aid and P.eid=H.eid and H.year='2008' and R.code= C.code",
                    function(err, result)
                    {
                        if (err) {
                            console.error(err.message);
                            callback(err, null);
                        }else{
                            // connection.close();
                            console.log(result.rows);
                            callback(null, result.rows);
                            // connection.close();
                        }
                    });
            }
            connection.close();
        });
};


var getPHILPS = function(callback){
    console.log("show countries vs philps ");
    oracledb.getConnection(
        connectData,
        function(err, connection)
        {
            if (err){
                console.log(err.message);
                return;
            }
            connection.execute(
            "   WITH PHELPS AS("+
            "   SELECT COUNT(*) AS PCOUNT"+
            "   FROM PERFORMANCEOFATHLETES P, ATHLETES A"+
            "   WHERE A.NAME = 'PHELPS, Michael' AND A.AID = P.AID AND P.MEDAL = 'Gold'),"+
            "   COUNTRYCOUNT AS("+
            "   SELECT CODE, SUM(NUM_OF_GOLD) AS ALLYEARGOLD"+
            "   FROM PERFORMANCEOFCOUNTRIES"+
            "   GROUP BY CODE)"+
            "   SELECT C.NAME AS Country, CC.ALLYEARGOLD AS totalgold"+
            "   FROM COUNTRYCOUNT CC, PHELPS Ph, COUNTRY C"+
            "   WHERE CC.ALLYEARGOLD < Ph.PCOUNT AND C.CODE = CC.CODE"+
            "   ORDER BY CC.ALLYEARGOLD DESC",
                function(err, result)
                {
                    if (err){
                        console.log(err.message);
                        return;
                    }
                    callback(null, result.rows);
                }
            )
        }
    )
};

module.exports = {
    getMenAndWomenPerform: getMenAndWomenPerform,
    getCountry: getCountry,
    getEvents: getEvents,
    getEconomicsOfHost: getEconomicsOfHost,
    getTopNAthletes: getTopNAthletes,
    showAthleteProfile: showAthleteProfile,
    getTopMedalsOfCountry: getTopMedalsOfCountry,
    getEconomics: getEconomics,
    getMaxRecordOfEvent: getMaxRecordOfEvent,
    /*dynanodb query*/
    getAllAthlete: getAllAthlete,
    getProfile: getProfile,
    getShowOnHomePage: getShowOnHomePage,
    getAllCountry: getAllCountry,
    recordofevents: recordofevents,
    getPHILPS: getPHILPS
}

/*
    getMenAndWomenPerform: getMenAndWomenPerform,
    getCountry: getCountry,
    getEvents: getEvents,
    getEconomicsOfHost: getEconomicsOfHost,
    getTopNAthletes: getTopNAthletes,
    showAthleteProfile: showAthleteProfile,
    getTopMedalsOfCountry: getTopMedalsOfCountry,
    getEconomics: getEconomics,
    getMaxRecordOfEvent: getMaxRecordOfEvent
*/


// oracledb.getConnection(
//     connectData,
//     function(err, connection)
//     {
//         if (err) {
//             console.error(err.message);
//             return;
//         }
//         connection.execute(
//             "   SELECT *" +
//             "   FROM (" + 
//             "   SELECT *" +
//             "   FROM performanceofcountries"+
//             "   WHERE year = 2008 "+
//             "   ORDER BY num_of_gold DESC )" + 
//             "   WHERE ROWNUM <= 10",    
//         function(err, result)
//             {
//                 if (err) {
//                     console.error(err.message);
//                     return;
//                 }
//                 console.log(result.rows);
//             });
// });
