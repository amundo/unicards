
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
    //this.fuse = new Fuse(this.words);
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

// Set of selected characters
app.Palette = Backbone.Collection.extend({

  model: app.Unichar

})


app.PaletteView = Backbone.View.extend({
  el: '#palette',

  collection: app.palette,

  initialize: function(options){
    this.template = _.template($('#letterTemplate').html()); 
    this.collection.on('add remove change', this.render, this) ;
  },

  render: function(){
    var self = this;
    this.el.innerHTML = '';
    this.collection.each(function(c){
      $(self.el).append(self.template(c.toJSON()));
    })
  }
})

app.SearchView = Backbone.View.extend({

  events: {
    'keyup input': 'keyup' ,
    'click li': 'select' 
  },

  initialize: function(){
    _.bindAll(this, 'render', 'keyup', 'select');

    this.template = _.template($('#unicharTemplate').html());

    this.input = this.el.querySelector('input');
    this.ol = this.el.querySelector('ol');
  },

  select: function(ev){
    var uid = ev.currentTarget.id;
    var match = this.collection.where({ Code_value: uid.replace('U','')});
    app.palette.add(match);
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

app.palette = new app.Palette( );

app.paletteView = new app.PaletteView({
  collection : app.palette
});

app.search = new app.SearchView({
  el: 'main',
  //palette: app.palette,
  collection: app.unicode
});


