
app = {};

app.Unichar = Backbone.Model.extend({

  initialize: function(){
    var codepoint = this.get('Code_value');
    var unichar = String.fromCharCode(parseInt(codepoint, 16));
    this.set('unichar', unichar);
  },

})

app.Unicode = Backbone.Collection.extend({

  model: app.Unichar,

  initialize: function(){
    this.deferred = this.fetch()
  },

  url: '../UnicodeData.json',

  search: function(query){
    var query = query.toUpperCase();
    var result = this.filter(function(c){ 
      return c.get('Character_name').indexOf(query) > -1; 
    })
    return result;
  }

})

app.PaletteView = Backbone.View.extend({

})

app.SearchView = Backbone.View.extend({

  events: {
    'keyup input': 'keyup' 
  },

  initialize: function(){
    //this.listenTo(this.collection, 'search', 
    _.bindAll(this, 'keyup');
    this.template = _.template($('#unicharTemplate').html());
    this.input = this.el.querySelector('input');
    this.ol = this.el.querySelector('ol');
  },

  keyup: function(ev){
    var self = this;
    var keycode = ev.which;
    var query = this.input.value; 

    if(keycode == 13){
      this.result = this.collection.search(this.input.value.trim());
      this.render();
    }
  }, 

  render: function(){
    var self = this;
    this.ol.innerHTML = '';
    this.result.forEach(function(unichar){
      var view = self.template(unichar.toJSON());
      $(self.ol).append(view);
    })
    return this;
  }

})


app.unicode = new app.Unicode();
app.unicode.fetch();

app.palette = new app.PaletteView({
  el: '#palette',
  initialize: function(options){
    
  }
})

app.search = new app.SearchView({
  el: 'main',
  palette: app.palette,
  collection: app.unicode
});


