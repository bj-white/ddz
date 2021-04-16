const youxian = {
  3: 1,
  4: 2,
  5: 3,
  6: 4,
  7: 5,
  8: 6,
  9: 7,
  10: 8,
  11: 9,
  12: 10,
  13: 11,
  1: 12,
  2: 13,
  s1: 14,
  s2: 15,
};

function Game () {
  this.players = [];
  this.cards = [];
  this.dipai = [];
  this.guo = [];
  this.guoType = null;
  this.uiTimer = null;
  this.activeId = null;
}

Game.prototype = {
  // 开始游戏
  start: function () {
    this.initPlayers();
    // this.initCards();
    this.moniCards();
    this.fapai();
    this.initUI();
    /* this.uiTimer = setInterval(() => {
      // this.players[1].cards.splice(1, 1);
      this.initUI();
    }, 1000); */
  },
  // 初始化玩家
  initPlayers: function () {
    for (let i = 0; i < 3; i++) {
      this.players.push(new Players(this, i, i + '号', 10));
    }
  },
  // 模拟牌
  moniCards: function () {
    var id = 1;
    var a = [3, 4, 5, 6, 7, 8, 9, 10, 11, 11, 11, 13, 13, 13, 13, 's1', 's2'];
    var b = [5, 6, 7, 8, 9, 8, 8, 9, 9, 10, 10, 12, 12, 1, 1, 1, 1];
    var c = [3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 7, 12, 2, 2, 2, 2];
    var d = [12, 10, 11];
    
    for (var i = 0; i < a.length; i++) {
      this.cards.push(new Card(id++, a[i], 1, youxian[a[i]]));
      this.cards.push(new Card(id++, b[i], 1, youxian[b[i]]));
      this.cards.push(new Card(id++, c[i], 1, youxian[c[i]]));
    }

    for (var i = 0; i < d.length; i++) {
      this.cards.push(new Card(id++, d[i], 1, youxian[d[i]]));
    }
  },
  // 洗牌
  initCards: function () {
    const list = [];
    for (let i = 1; i <= 54; i++) {
      var number;
      if (i == 53) {
        number = 's1';
      } else if (i == 54) {
        number = 's2';
      } else {
        number = Math.ceil(i / 4);
      }
      list.push({
        id: i,
        number: number,
        type: 1,
        youxian: youxian[number],
      });
    }
    
    while (list.length) {
      const random = (Math.random() * (list.length - 1)).toFixed();
      this.cards.push(new Card(
        list[random].id,
        list[random].number,
        list[random].type,
        list[random].youxian,
      ));
      list.splice(random, 1);
    }
  },
  fapai: function () {
    // 底牌
    this.dipai = this.cards.splice(-3);

    // 发牌
    for (var i = 0; i < this.cards.length; i++) {
      if (i % 3 === 0) {
        this.cards[i].ower = 0;
        this.players[0].cards.push(this.cards[i]);
      } else if (i % 3 === 1) {
        this.cards[i].ower = 1;
        this.players[1].cards.push(this.cards[i]);
      } else {
        this.cards[i].ower = 2;
        this.players[2].cards.push(this.cards[i]);
      }
    }

    // 玩家牌排序
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].cards.sort(this.cardSort);
    }
    
    var rd = (Math.random() * 2).toFixed();
    this.players[rd].isDiZhu = true;
    this.activeId = rd;
  },
  cardSort: function (a, b) {
    return b.youxian - a.youxian;
  },
  initUI: function () {
    let html = '';
    for (let i = 0; i < this.players.length; i++) {
      html += '<div class="player' + (this.players[i].isDiZhu ? ' dizhu': '') + (i == this.activeId ? ' active' : '') + '"><div class="card_wrapper">';
      var cards = this.players[i].cards;
      for (let j = 0; j < cards.length; j++) {
        html += '<span class="card" data-i="' + j + '">' + cards[j].number + '</span>';
      }
      html += '</div><div class="btn_wrapper"><button class="chupai">chupai</button><button class="buchu">buchu</button></div></div>';
    }

    html += '<div class="dipai">';
    for (let i = 0; i < this.dipai.length; i++) {
      html += '<span class="card">' + this.dipai[i].number + '</span>';
    }
    html += '</div>';

    html += '<div class="guo">';
    for (let i = 0; i < this.guo.length; i++) {
      html += '<span class="card">' + this.guo[i].number + '</span>';
    }
    html += '</div>';

    document.querySelector('#container').innerHTML = html;
  },
  computeActive: function () {
    this.activeId = (this.activeId + 1) % 3;
    this.initUI();
  },
  buchu: function () {
    this.players[this.activeId].buchu();
  },
  chupai: function (list) {
    this.players[this.activeId].chupai(list);
  },
  bidaxiao: function (cards, type) {
    // 先出牌
    if (!this.guo.length) {
      return true;
    }
    // 要不起
    if (this.guo[0].ower == this.activeId) {
      return true;
    }

    // 王炸
    if (type == 'wangzha') {
      return true;
    }
    // 炸弹
    if (type == 'zhadan') {
      if (this.guoType == 'wangzha') {
        return false;
      } else if (this.guoType == 'zhadan') {
        if (cards[0].youxian > this.guo[0].youxian) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
    if (this.guoType != type) {
      console.log('类型不匹配');
      return false;
    }
    // 单/双/三 3
    if (this.guoType == 'yizhang' || this.guoType == 'liangzhang' || this.guoType == 'sanzhang') {
      if (cards[0].youxian > this.guo[0].youxian) {
        return true;
      }
    }
    // 三带 2
    if (type.indexOf('sandai') != -1) {
      if (cards[0].youxian > this.guo[0].youxian) {
        return true;
      }
    }
    // 顺子
    if (type.indexOf('shun') != -1) {
      if (cards[0].youxian > this.guo[0].youxian) {
        return true;
      }
    }
    // 连对
    if (type.indexOf('liandui') != -1) {
      if (cards[0].youxian > this.guo[0].youxian) {
        return true;
      }
    }
    // 四带
    if (type.indexOf('sidai') != -1) {
      if (cards[0].youxian > this.guo[0].youxian) {
        return true;
      }
    }
    console.log('太小');
    return false;
  }
};