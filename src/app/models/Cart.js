module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    
    this.add = function(item, id, soluong) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
            storedItem.qty = parseInt(soluong);
            storedItem.price = storedItem.item.giaban * storedItem.qty;
            
            this.totalQty += parseInt(soluong) ;
           
    };

    this.update = function(id, soluong){
        this.totalQty = this.totalQty - this.items[id].qty;
    
        this.items[id].qty = parseInt(soluong);
        this.items[id].price = this.items[id].item.giaban * parseInt(soluong);

        this.totalQty += parseInt(soluong);
    };
    

    this.removeItem = function(id){
        this.totalQty -= this.items[id].qty;
        // this.totalPrice -= this.items[id].price;
        delete this.items[id];
    }

    this.generateArray = function() {
        var arr = [];
        for (var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
};
