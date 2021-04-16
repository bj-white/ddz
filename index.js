var game;
document.querySelector('#start').addEventListener('click', start);

document.body.addEventListener('click', function (e) {
  var target = e.target;
  if (hasClass(target, 'card')) {
    if (hasClass(target, 'active')) {
      removeClass(target, 'active');
    } else {
      addClass(target, 'active');
    }
  }

  if (hasClass(target, 'buchu')) {
    game.buchu();
  }
  if (hasClass(target, 'chupai')) {
    var list = document.querySelectorAll('.player.active .card_wrapper .card.active');
    for (var i = 0, result = []; i < list.length; i++) {
      result.push(list[i].getAttribute('data-i') - 0);
    }
    game.chupai(result);
  }
});

function start () {
  game = new Game();
  game.start();
  console.log(game);
}

// start();

/**
 * 1、单张
 * 2、对子
 * 3、顺子
 * 4、三带一
 * 5、三带二
 * 6、飞机
 * 7、炸弹
 */
