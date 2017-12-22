const fs=require('fs');
const axios=require('axios');
const path=require('path');
const api_base="https://api.opendota.com/api";
const api_player="players";
const profile_display=document.getElementById("profile");
const profile_name=document.getElementById("profile_name");
const avatar=document.getElementById("avatar");
const recent="recentMatches";
const recent_container=document.getElementById("recent_matches")

const mode_dict={23:"Turbo",1:"All Pick Bot",22:"All Pick",19:"Frost Event"}

var id=92533591;

var heroes=JSON.parse(fs.readFileSync("src/heroes.json"));

function display_profile(id)
{
    var profile_url=path.join(api_base,api_player,id.toString());
    axios.get(profile_url).then(function(res){
        var profile_raw=res.data['profile'];
        
        //profile_display.innerHTML+=JSON.stringify(profile_raw);
        profile_name.innerHTML=profile_raw['personaname'];
        avatar.src=profile_raw["avatarmedium"]

    });
    var recent_url=path.join(profile_url,recent);
    axios.get(recent_url).then(function(res){
        var matches=res.data;
        for(var i=0;i<matches.length;i++)
        {
            match=matches[i];
            var row=document.createElement("span");
            row.className="row";
            var img_container=document.createElement('div');
            var img=document.createElement("img");
            img.src=get_hero_avatar(match["hero_id"]);
            img_container.appendChild(img);
            
            
            var matchid=document.createElement("div");
            matchid.innerHTML=match['match_id'];
            var result=document.createElement("div");
            if((match["radiant_win"]==true && match['player_slot']<100)||(match["radiant_win"]==false && match['player_slot']>100))
            {
                result.innerHTML="Victory";
            }
            else
            {
                result.innerHTML="Defeat";
            }

            var kda=document.createElement('div');
            kda_txt=match['kills'].toString()+'/'+match['deaths'].toString()+'/'+match['assists'].toString();
            kda.innerHTML=kda_txt;
            
            var mode=document.createElement('div');
            mode.innerHTML=mode_dict[match['game_mode']];

            var duration=document.createElement('div');
            duration_sec=match['duration'];
            minute=parseInt(duration_sec/60);
            
            sec=duration_sec%60;
            duration.innerHTML=minute.toString()+":"+sec.toString();
            var newline=document.createElement("br");
            row.appendChild(img_container);
            

            row.appendChild(matchid);
            row.appendChild(result);
            row.appendChild(kda);
            row.appendChild(mode);
            row.appendChild(duration);

            row.appendChild(newline);
            recent_container.appendChild(row);
        }

    });
    
}

function get_hero_avatar(hero_id)
{
    for(i=0;i<heroes.length;i++)
    {
        if(heroes[i]['id']==hero_id)
        {
            hero_name_raw=heroes[i]["name"];
            
            trimmed_name=hero_name_raw.slice(14);//length of "npc_dota_hero_"
            img_file_name=trimmed_name+"_sb.png"
            return path.join("http://cdn.dota2.com/apps/dota2/images/heroes",img_file_name);
        }
    }
    
}

display_profile(id);