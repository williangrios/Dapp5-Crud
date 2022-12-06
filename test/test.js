const Crud = artifacts.require("Crud");

contract('Crud', () => {

    let crud = null;
    before(async() => {
        crud = await Crud.deployed();

    })
  
    it('Should create a new user', async () => {
        crud.create('Willian');
        
        const result = await crud.read(1);

        assert (result[0].toNumber() === 1);
        assert (result[1] === 'Willian');
        
    });

    it('Should update a user', async () => {
      
        await crud.update(1, "Willian Rios");
        const result = await crud.read(1);

        assert (result[0].toNumber() === 1);
        assert (result[1] === "Willian Rios");
        
    });

    it('Should NOT update a non-existing user', async () => {
        try {
            //fazemos assim porque esperamos um error da blockchain
            await crud.update(1232, "Willian Rios Non Exists");      
        } catch (error) {
            assert(error.message.includes("User does not exist!"))
            return;
        }
        //se chegar aqui o teste falhou pois era para dar erro e não deu
        assert(false);
    });

    it('Should delete user', async () => {
        await crud.destroy(1);    
        try {
            await crud.read(1);
        } catch (error) {
            assert(error.message.includes("User does not exist!"))
            return;
        }
        assert(false);
    });

    it('Should NOT delete user', async () => {
        
        try {
            await crud.destroy(10);    
        } catch (error) {
            assert(error.message.includes("User does not exist!"))
            return;
        }
        assert(false);
    });

});
