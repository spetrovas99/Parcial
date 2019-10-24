import {GraphQLServer} from "graphql-yoga";
import {fetchData} from "./fetchdata";
const url = "https://swapi.co/api/people/?format=json";
let n;
const runApp = data =>{
    const typeDefs =
    `type Query{
        people(page: Int, number: Int, name: String, gender: String): [Character!]!
        character(id: Int!): Character!
        characters(name:String!): [Character]!
    }

    type Character{
        name: String!
        gender: String!
        url:String!
        films: [Films!]!
    }
    type Films{
        title: String!
        episode: Int!
    } 
    `
    const resolvers ={
        Query:{
            people:(parent,args,ctx,info)=>{
                let result = [];
                let concat = data;
                let page = args.page || 1;
                let number = args.number || 20;
                if(args.name){
                    concat = concat.filter(obj => (obj.name).includes(args.name)); 
                }
                if(args.gender){
                    concat = concat.filter(obj => obj.gender === (args.gender)); 
                }
                for(let i=(page-1)*number; i<number*page; i++){
                        result.push({
                            name: concat[i].name,
                            gender: concat[i].gender,
                            url: concat[i].url,
                           
                            
                    });
                }
                console.log(result);
                return result;
            },
            character(parent,args,ctx,info){
                const result = data.find((elem) => {
                    if(elem.id === args.id ){
                        return data[args-1];
                    }
                });
           }, 
           characters(parent,args,ctx,info){
            let aux = data;
            let result = [];
            if(args.name){
             aux = aux.filter(elem => (elem.name).includes(args.name));
            }
            aux.forEach(element => {
                result.push({
                    name: element.name,
                    gender: element.gender,
                    films: element.films,
                    url: element.url,
                });
            });
            console.log(result);
            return(result);
        },
    }
};
    const server = new GraphQLServer({typeDefs,resolvers});
    server.start();
}  
fetchData(runApp,url);