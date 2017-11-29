var  knex = require('knex');

    const insert = [
        {
            name: 'hello world',
            writer: 'mike'
        },{
            name: 'hello awesome',
            writer: 'nun'
        },{
            name: 'this is awesome lib',
            writer: 'mike'
        }
    ]
class normalKnex{

    constructor(){
        this.knex = knex({
            client: 'mysql',
            connection: {
              host : '127.0.0.1',
              user : 'root',
              password : '',
              database : 'knex'
            },
            pool: { min: 0, max: 7 }
          });
        this.prepareDb().then(() => {
            this.CRUD();
        })
    }

    async prepareDb(){
        await this.knex.schema.dropTableIfExists('Blog');
        await this.knex.schema.createTableIfNotExists('Blog', (tbl) => {
            tbl.increments('id').primary().unique().index();
            tbl.string('name');
            tbl.string('writer');
        });
    }

    async CRUD(){

        console.log("start doing normal CRUD");
        //batch insert
        await this.knex.batchInsert('Blog',insert);

        //query data
        let star = await this.knex('Blog').select();

        console.log("SELECT * FROM Blog");
        console.log(star);

        // single insert
        let id = await this.knex('Blog').insert({name: 'lonely insert', writer: 'lonely man'});
        console.log("retrive insert id from insert.");
        console.log("insert id: "+id);

        //query with where
        let where = await this.knex('Blog').where({writer: 'mike'}).select();
        console.log("SELECT * FROM Blog WHERE writer = 'mike'");
        console.log(where);
        
        //edit data
        await this.knex('Blog').where({writer: 'lonely man'}).update({name: 'not alone insert'});
        let edit = await this.knex('Blog').select();
        console.log("UPDATE Blog SET name = 'not alone insert' WHERE writer = 'lonely man'");
        console.log(edit);

        //delete data
        await this.knex('Blog').where({writer: 'mike'}).del();
        let del = await this.knex('Blog').select();
        console.log("DELETE from Blog WHERE writer = 'mike'");
        console.log(del);
    }
}

new normalKnex();
