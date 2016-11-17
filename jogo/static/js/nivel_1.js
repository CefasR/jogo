/*SEÇÃO: DECLARAÇÃO DE VARIÁVEIS IMPORTANTES*/

var matriz_pos = [
    // Matriz de posição dos toros. Cada número diz respeito a um toro.
  [0,0,0,0,1,2,3], //Poste 1
  [0,0,0,0,0,0,0], //Poste 2
  [0,0,0,0,0,0,0]  //Poste 3
];

var rc = {toro1:{x:-6,y:  0 },//Variável que abriga as coordenadas (x,y)dos toros.
          toro2:{x:-6,y:-0.7},//"rc" significa "recipiente de coordenadas"
          toro3:{x:-6,y:-1.2}}


/* Abaixo: variável que mapeia uma posição da matriz de posição para uma
coordenada cartesiana. Por exemplo: se eu estou no segundo poste e o toro mais
em cima, então as minhas coordenadas são x[1](ou seja, poste 2) e y[0](ou seja,
na primeira posição da matriz_pos de cima pra baixo!)
*/
var coordenadas_possiveis = {x:{0:-6,
                                1:0,
                                2:6},
                             y:{0:2.8,
                                1:2.1,
                                2:1.4,
                                3:0.7,
                                4:0,
                                5:-0.7,
                                6:-1.2}
                         }

// pegando o elemento CANVAS
var canvas = document.getElementById('renderCanvas');

// carregando a engine 3D que importamos do BABYLON
var engine = new BABYLON.Engine(canvas, true);

/*FIM SEÇÃO*/


/* SEÇÃO: MAIN*/

window.addEventListener('DOMContentLoaded', function(){
    // construindo a cena
    var scene = createScene();

    // renderiza o loop para a cena aparecer
    engine.runRenderLoop(function(){
        scene.render();
    });

    //criando um evento para mudar a posição do toro quando o botão de id=muda for clicado
    $("#muda").click(function(){
        de = $("#de_field").val() - 1
        para = $("#para_field").val() - 1
        movimentar_toro(de,para);
        estado_invalido();
        atualizar_coordenadas();
        scene = createScene();
       });

});

/* FIM SEÇÃO */

/* SEÇÃO: FUNÇÕES*/

function movimentar_toro(poste_origem, poste_destino) {
    /*Busca o toro de cima do poste_origem e o posiciona no topo
    do poste_destino. Os postes são 0, 1 e 2!
    */
    meu_toro = 0;
    //1º: encontrar o toro
    for (i = 0; i < 7; i++){
        if (matriz_pos[poste_origem][i] != 0){
            meu_toro = matriz_pos[poste_origem][i];
            matriz_pos[poste_origem][i] = 0;
            break;
        }
        if (i == 6){
            console.log("Aviso: toro não encontrado. O poste está vazio.");
        }}
    //2º: sua posição final
    if (meu_toro != 0){
        for (i = 0; i < 7; i++){
            if (matriz_pos[poste_destino][i] != 0){
                matriz_pos[poste_destino][i-1] = meu_toro;
                break;
            }
            if (i == 6){
                matriz_pos[poste_destino][i] = meu_toro;
            }}}
}

function atualizar_coordenadas(){
    /*Analisa a matriz de posições e atualiza rc(recipiente de coordenadas).
    Escolhi usar vários laços ao invés de vários IFs pois é mais organizado.
    */
    //Encontrar e atualizar para o toro 1:
    for (poste = 0; poste < 3; poste++){
        for (altura = 0; altura < 7; altura++){
            if (matriz_pos[poste][altura] == 1){
                rc.toro1.x = coordenadas_possiveis.x[poste]
                rc.toro1.y = coordenadas_possiveis.y[altura]
            }}}
    //Encontrar e atualizar para o toro 2:
    for (poste = 0; poste < 3; poste++){
        for (altura = 0; altura < 7; altura++){
            if (matriz_pos[poste][altura] == 2){
                rc.toro2.x = coordenadas_possiveis.x[poste]
                rc.toro2.y = coordenadas_possiveis.y[altura]
            }}}
    //Encontrar e atualizar para o toro 3:
    for (poste = 0; poste < 3; poste++){
        for (altura = 0; altura < 7; altura++){
            if (matriz_pos[poste][altura] == 3){
                rc.toro3.x = coordenadas_possiveis.x[poste]
                rc.toro3.y = coordenadas_possiveis.y[altura]
            }}}
}

function logar_matriz_pos(){
    /*Printa no console a variável matriz_pos para fins de debug
    */
    console.log('matriz_pos:')
    for (nivel = 0; nivel < 7; nivel++){
        linha = ''
        for (poste = 0; poste < 3; poste++){
            linha += ' ' + matriz_pos[poste][nivel].toString();
        }
        console.log(linha)
    }
}

function estado_invalido(){
    /*Retorna valor booleano verdadeiro se o estado atual do jogo for inválido, isto é,
    se houver uma peça qualquer em cima de outra menor.
    */
    for (poste = 0; poste < 3; poste++){
        for (nivel = 1; nivel < 7; nivel++){
            if (matriz_pos[poste][nivel] < matriz_pos[poste][nivel-1]){
                console.log('Jogada invalida realizada.')
                return false;
            }}}
}

function popular_toros(qtd){
    /*Declara a quantidade de toros de acordo com o nivel de dificuldade.
    */
}

function createScene(){
    /*Função que constrói a cena
    */
    // criando o objeto-base de cena
    var scene = new BABYLON.Scene(engine);

    // criando a FreeCamera, e setando sua posição para (x:0, y:5, z:-10) é ela que vai dar
    // a perspectiva de onde estaremos olhando os elementos
    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5,-10), scene);

    // direcionando o camera para a origem da cena
    camera.setTarget(BABYLON.Vector3.Zero());

    // criando a iluminação, direcionada para 0,1,0 - que é pra cima
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,-0.5), scene);

    // criando os elementos
    var torus = BABYLON.Mesh.CreateTorus("torus", 1, 1, 10, scene);
    var torus2 = BABYLON.Mesh.CreateTorus("torus2", 2, 1, 10, scene);
    var torus3 = BABYLON.Mesh.CreateTorus("torus3", 3, 1, 10, scene);
    var cylinder = BABYLON.Mesh.CreateCylinder("cylinder", 4, 0.3, 0.3, 6, 1, scene);
    var cylinder2 = BABYLON.Mesh.CreateCylinder("cylinder2", 4, 0.3, 0.3, 6, 1, scene);
    var cylinder3 = BABYLON.Mesh.CreateCylinder("cylinder3", 4, 0.3, 0.3, 6, 1, scene);

    // isso é para mudar a cor, e também podemos usar imagems para ser a textura usando o diffuseTexture
    var materialtorus = new BABYLON.StandardMaterial("texture1", scene);
    torus.material = materialtorus;
    torus2.material = materialtorus;
    torus3.material = materialtorus;
    materialtorus.diffuseColor = new BABYLON.Color3(0.9, 0.29, 0.23);

    //posição dos elementos no eixo X
    torus.position.x = rc.toro1.x;
    torus2.position.x= rc.toro2.x;
    torus3.position.x= rc.toro3.x;
    cylinder.position.x = -6;
    cylinder2.position.x = 0;
    cylinder3.position.x = 6;

    // posição dos elementos no eixo Y
    torus.position.y = rc.toro1.y;
    torus2.position.y= rc.toro2.y;
    torus3.position.y= rc.toro3.y;
    cylinder.position.y = 1;
    cylinder2.position.y = 1;
    cylinder3.position.y = 1;

    // retorna a cena que criamos
    return scene;
}

/* FIM SEÇÃO */
