/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, fetch */

$(document).ready(function(){
  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#Pkmnlist li").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

var pokemon, pokesets;

function readInSets() {
    fetch("/1v1data/1v1Sets.txt").then(response =>{
        if (response.ok){
            response.text().then(encapsulateSets)
        } else console.log("Could not access 1v1 sets " + response.status + ": " + response.statusText)
    }).catch(error => console.error(error))
}

function readViability(){
    fetch("/1v1data/viability.txt").then(response => {
        if (response.ok){
            response.text().then(text => updateRanking(text))
        } else console.log("Could not access viability rankings " + response.status + ": " + response.statusText)
    }).catch(error => console.error(error))
}

function updateRanking(text){
    text = text.split(/\n{3}|\r\n\r\n\r\n/)
    text.map(block => {
      block = block.split(/\r\n|\n/)
      var rank = block[0].split(" ")[0], pokemonToRank = block.slice(1).map(s => s.replace(/^ /, ''))
      for (var i in pokemonToRank){
          var name;
          if (pokemonToRank[i] == "Deoxys-S") name = "Deoxys-Speed"
          else if (pokemonToRank[i] == "Vivillon") name = "Vivillon-Marine"
          else if (pokemonToRank[i] == "Meowstic-M") name = "Meowstic"
          else name = pokemonToRank[i]
          if (name in pokemon) {
              pokemon[name]['rank'] = rank
              $('#' + idFromName(name)).find(".PkmnRanking").get(0).innerHTML = rank
          }
          else console.log("Could not read in " + name)
      }
    })
}

function encapsulateSets(pokemonSets){
    if (!(pokemonSets)) return ;
    pokesets = pokemonSets.replace(/\r/g,'').split(/\n{2}/).map(buildPokemon)
    pokemon = pokesets.reduce((li, set) => (li[set["name"]] = {rank: 'U'}, li), {})
    generateHTMLList()
    readViability()
}

function buildPokemon(set){
    list = set.split('\n')
    list = list.slice(1)
    const head = list[0]
    if (head == '') return undefined
    let [na, it] = head.split(/ @ /), mon = {moves: []}
    if (/\s\(\w\)$/.test(na)) {
        mon['gender'] = na.charAt(na.length - 2)
        na = na.substr(0, na.length - 4)
    }
    mon['name'] = na
    if (it != undefined) mon['item'] = it
    for (let i = 1; i < list.length; i++){
        let line = list[i]
        if (/[\:]/.test(line)){
            let [key, val] = line.split(/[\:] /, 2)
            if (key == 'EVs' || key == 'IVs') 
                val = val.replace(/^[^\w]/,'').split(/ \/ /)
                    .reduce((acc, e) => ([val, stat] = e.split(/ /), acc[stat] = +val, acc), {})
            mon[key] = val
        } else if (/Nature/.test(line)) mon['nature'] = line.match(/\w*/)[0]
        else if(line.charAt(0) == '-') mon['moves'].push(line.replace(/^[^\w]/, ''))
        else console.log("Found unusual line in imported set: " + line)
    }
    return mon
}

idFromName = name => name.replace(/[^\w]/g, '')

function generateHTMLList(){
    var ul = $("ul"), template = ul.find("li:nth-child(1)")
    template.get(0).style.display = "block"
    template.find(".PkmnRanking").get(0).innerHTML = 'U'
    template.find(".PkmnClass").bind('dblclick', function(){$(this).attr('contenteditable', true)})
    for (let name in pokemon){
        var li = template.clone(true)
        li.get(0).id = idFromName(name)
        li.find(".Pkmndatabtn").get(0) //This line needs to be fix to fit the buttons we are using.
        li.find(".PkmnName").get(0).innerHTML = name
        li.find(".PkmnIcon").find('img').get(0).src = "../PokemonIcons/" + 
            name.toLowerCase().replace(" ", "-").replace(":", "") + ".png"
        ul.append(li)
    }
    ul.find("li:nth-child(1)").get(0).style.display = "none"
}

//Create a function or Python Function if you want that can rip sprite data from PS Dex (The animated GIFS) and place them on the Pkmn Team Fluid.

//Create a function or Python Function that will read Classifications.txt and be able to do the same as what readviability has been doing




readInSets();
console.log("1 + 1 is 2 and everything that follows is true")