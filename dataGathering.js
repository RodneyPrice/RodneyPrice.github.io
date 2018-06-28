/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, fetch */
var pksets, pokemon;
function readInSets() {
    "use strict";
    fetch("1v1Sets.txt").then(response =>{
        if (response.ok){
            response.text().then(encapsulateSets)
        } else console.log("Could not access 1v1 sets " + response.status + ": " + response.statusText)
    })
}

function readViability(){
    fetch("viability.txt").then(response => {
        if (response.ok){
            response.text().then(updateRanking)
        } else console.log("Could not access viability rankings " + response.status + ": " + response.statusText)
    })
}

function updateRanking(text){
    text = text.replace(/\r/g,'').split(/\n{3}/)
    text.map(block => {
      block = block.split(/\n/)
      var rank = block[0].split(" ")[0], pokemon = block.slice(1).map(s => s.replace(/ /, ''))
      for (var i in pokemon){
          var query;
          if (pokemon[i] == "Deoxys-S") query = "#Deoxys-Speed"
          else if (pokemon[i] == "Vivillon") query = tmp = "#Vivillon-Marine"
          else if (pokemon[i] == "Meowstic-M") query = "#Meowstic"
          else query = "#" + pokemon[i].replace(":", "").replace(" ", "-")
          console.log(query)
          tmp = $(query).find(".PkmnRanking").get(0)
          if (tmp != undefined) tmp.innerHTML = rank
          else console.log(query, tmp)
      }
    })
    
}

function encapsulateSets(pokemonSets){
    if (!(pokemonSets)) return ;
    pksets = pokemonSets.replace(/\r/g,'').split(/\n{2}/).map(set => set.split('\n'))
        .map(list => 
            {return {name: list[0].split(" @ ")[0].split(" (")[0],
                     item: list[0].split(" @ ")[1],
                     ability: list[1].split(/ /)[1],
                     EVs: list[2].split(": ")[1].split(" / ").map(s => s.split(" "))
                        .map(s => {var ev = {}; ev[s[1]] = +s[0]; return ev}),
                     nature: list[3].split(" ")[0],
                     moves: list.splice(-4).map(s => s.substr(2))
                    }
             })
    
    pokemon = Object.keys(pksets.reduce((li, set) => (li[set["name"]] = 0, li), {}))
    var ul = $("ul"), template = ul.find("li:first")
    template.get(0).style.display = "block"
    template.find(".PkmnRanking").get(0).innerHTML = "U"
    //template.find(".PkmnClass").bind('dblclick', function(){$(this).attr('contenteditable', true)})
    for (let x in pokemon){
        name = pokemon[x]
        var li = template.clone(true)
        li.get(0).id = name.replace(":", "").replace(" ", "-")
        li.find(".PkmnName").get(0).innerHTML = name
        li.find(".PkmnIcon").find('img').get(0).src = "PokemonIcons/" + name.toLowerCase().replace(" ", "-").replace(":", "") + ".png"
        ul.append(li)
    }
    ul.find("li:first").get(0).style.display = "none"
    readViability()
}

readInSets();