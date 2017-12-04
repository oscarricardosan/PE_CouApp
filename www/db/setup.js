var fdb = new ForerunnerDB(),
    db = fdb.db("courier_app");
//db.persist.driver("IndexedDB"); //Calidad: 10 - 404kB
db.persist.driver("WebSQL"); //Calidad: 9 - 344Kb
//db.persist.driver("LocalStorage"); //Calidad: 0 - 0
