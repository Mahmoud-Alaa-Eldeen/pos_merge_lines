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
    
}