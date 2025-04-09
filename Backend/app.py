from flask import Flask, request, jsonify
from flask_cors import CORS
import osmnx as ox
import networkx as nx

app = Flask(__name__)
CORS(app)

graph = ox.graph_from_place("Bengaluru,India",network_type='drive')

@app.route('/route',methods=['POST'])
def get_route():
    data = request.get_json()
    origin = data['origin']
    destination = data['destination']

    origin_node = ox.distance.nearest_nodes(graph,origin[1],origin[0])
    destination_node = ox.distance.nearest_nodes(graph,destination[1],destination[0])

    shortest_path_calculate = nx.shortest_path(graph,origin_node,destination_node,weight='length')
    path_cords = [(graph.nodes[n]['y'],graph.nodes[n]['x']) for n in shortest_path_calculate]

    return jsonify({'route':path_cords})