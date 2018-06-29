/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, fetch */
var pokemon, pokesets;

function readInSets() {
    fetch("1v1Sets.txt").then(response =>{
        if (response.ok){
            response.text().then(encapsulateSets)
        } else console.log("Could not access 1v1 sets " + response.status + ": " + response.statusText)
    }).catch(error => console.error(error))
}

function readViability(){
    fetch("viability.txt").then(response => {
        if (response.ok){
            response.text().then(text => updateRanking(text))
        } else console.log("Could not access viability rankings " + response.status + ": " + response.statusText)
    }).catch(error => console.error(error))
}

function updateRanking(text){
    text = text.split(/\n{3}|\r\n{3}/)
    text.map(block => {
      block = block.split(/\n/)
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
    var ul = $("ul"), template = ul.find("li:first")
    template.get(0).style.display = "block"
    template.find(".PkmnRanking").get(0).innerHTML = 'U'
    template.find(".PkmnClass").bind('dblclick', function(){$(this).attr('contenteditable', true)})
    for (let name in pokemon){
        var li = template.clone(true)
        li.get(0).id = idFromName(name)
        li.find(".PkmnLink").get(0).href = ("#/" + name)
        li.find(".PkmnName").get(0).innerHTML = name
        li.find(".PkmnIcon").find('img').get(0).src = "PokemonIcons/" + 
            name.toLowerCase().replace(" ", "-").replace(":", "") + ".png"
        ul.append(li)
    }
    ul.find("li:first").get(0).style.display = "none"
}

readInSets();