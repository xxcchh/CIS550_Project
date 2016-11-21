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
oracledb.getConnection(
   connectData,
    function(err, connection)
    {
        if (err) {
            console.error(err.message);
            return;
        }
        connection.execute(
            "SELECT * FROM economics ",
            function(err, result)
            {
                if (err) {
                    console.error(err.message);
                    return;
                }
                console.log(result.rows);
            });
    });


