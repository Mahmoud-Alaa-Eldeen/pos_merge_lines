/*jshint plusplus: true */
/*jshint nomen: false */
/*jshint node: true */

function openerp_merge_lines(instance, module){
    // Setting Use strict
    "use strict";
    
    module.MergeLinesOrder = module.Order;
    module.Order = module.MergeLinesOrder.extend({
        addProduct: function(product, options){
            var attr = JSON.parse(JSON.stringify(product));
            var self = this;
            var added = false;
            options = options || {};
            attr.pos = this.pos;
            attr.order = this;
            var line = new module.Orderline({}, {pos: this.pos, order: this, product: product});

            if(options.quantity !== undefined){
                line.set_quantity(options.quantity);
            }
            if(options.price !== undefined){
                line.set_unit_price(options.price);
            }
            if(options.discount !== undefined){
                line.set_discount(options.discount);
            }

            if(self.get('orderLines').at(self.get('orderLines').length -1)) {
                self.get('orderLines').each(function(orderline){
                    if(orderline && orderline.can_be_merged_with(line) && options.merge !== false) {
                        orderline.merge(line);
                        added = true;
                        self.selectLine(orderline);
                        return;
                    }
                });
            }
            if(added){return;}
            this.get('orderLines').add(line);
            this.selectLine(this.getLastOrderline());
        },
    });
    
    module.MergeLinesOrderline = module.Orderline;
    module.Orderline = module.MergeLinesOrderline.extend({
        // when we add an new orderline we want to merge it with other lines to see reduce the number of items
        // in the orderline. This returns true if it makes sense to merge the two
        // TODO: this function overrides default point of sale behavior on Odoo that
        // prevents merge items in other units than pieces 
        can_be_merged_with: function(orderline){
            if( this.get_product().id !== orderline.get_product().id){    //only orderline of the same product can be merged
                return false;
            }else if(this.get_product_type() !== orderline.get_product_type()){
                return false;
            }else if(this.get_discount() > 0){             // we don't merge discounted orderlines
                return false;
            }else if(this.price !== orderline.price){
                return false;
            }else{ 
                return true;
            }
        },        
    });
}