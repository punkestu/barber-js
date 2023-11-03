const mysql = require("mysql2");

class Db {
    static Conn;

    static Init(connStr) {
        this.Conn = mysql.createPool(connStr);
        this.Conn.query('SELECT 1', function (error) {
            if (error) throw error;
            return true;
        });
    }

    static Query(sql, params = []) {
        return new Promise((res, rej) => {
            this.Conn.query(sql, params, function (error, results) {
                if (error) return rej(error);
                return res(results);
            });
        });
    }

    static QueryOne(sql, params = []) {
        return this.Query(sql + " LIMIT 1", params).then(r => r[0] ? r[0] : null);
    }

    static Insert(table, values, option = {returns: true}) {
        const columns = this.#columns(values);
        return this.Query(`INSERT INTO ${table} (${columns[0]}) VALUES (${columns[1]})`, columns[2])
            .then(r => {
                if (option.returns) {
                    return this.QueryOne(`SELECT * FROM ${table} WHERE id=?`, [r.insertId]);
                }
                return {};
            });
    }

    static Delete(table, where = "") {
        return this.Query(`DELETE FROM ${table} WHERE ${where}`);
    }

    static Update(table, values, where = "") {
        return this.Query(
            `UPDATE ${table} SET ${this.#sets(values)} WHERE ${where}`,
            this.ValuesArr(values)
        );
    }

    // format and sanitize
    static #columns(columns) {
        const values = Object.values(columns).filter(c => typeof c !== 'undefined');
        return [
            Object.keys(columns).filter(c => typeof columns[c] !== 'undefined').join(", "),
            values.map(c => c ? "?" : "").join(", "),
            values
        ];
    }

    static #sets(values) {
        return Object.keys(values).filter(v => typeof values[v] !== 'undefined').map(v => `${v}=?`).join(`, `);
    }

    static Where(key, val) {
        return typeof val !== 'undefined' ? `${key}=${mysql.escape(val)}` : null;
    }

    static Wheres(params, op = "AND") {
        return Object.keys(params).reduce((result, key) => {
            result.push(this.Where(key, params[key]));
            return result;
        }, []).filter(e => e).join(` ${op} `);
    }

    static WhereCmp(key, val, op) {
        return typeof val !== 'undefined' ? `${key}${op}${mysql.escape(val)}` : null;
    }

    static WheresCmp(params, op = "AND") {
        return Object.keys(params).reduce((result, key) => {
            result.push(this.WhereCmp(key, params[key][1], params[key][0]));
            return result;
        }, []).filter(e => e).join(` ${op} `);
    }

    static ValuesArr(values) {
        return Object.values(values).filter(v => typeof v !== 'undefined');
    }
}

module.exports = Db;