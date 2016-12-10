const Connections = require('./index');

describe('Tools', function () {
  describe('Connections', function () {

    before('Create an instance', function () {
      this.con = new Connections();
    });

    it('Invalid items should not be added', function () {
      expect(() => this.con.add()).to.throw();
      expect(() => this.con.add({})).to.throw();
      expect(() => this.con.add({ socket: 's1' })).to.throw();
      expect(() => this.con.add({ room: 'r1' })).to.throw();
      expect(() => this.con.add({ user: 'r1' })).to.throw();
    });

    it('Valid item should be added and returned', function () {
      this.item = this.con.add({
        room: 'r1',
        user: 'u1',
        socket: 's1',
      });
      expect(this.item).to.be.an('object');
      expect(this.item).to.have.property('id').to.be.a('string');
      expect(this.item).to.have.property('room').to.be.a('string');
      expect(this.item).to.have.property('user').to.be.a('string');
      expect(this.item).to.have.property('socket').to.be.a('string');
      expect(this.item).to.have.property('createdAt').to.be.a('number');
    });

    it('Add many items should be ok', function () {
      this.con.add({ room: 'r1', user: 'u1', socket: 's1' });
      this.con.add({ room: 'r1', user: 'u2', socket: 's2' });
      this.con.add({ room: 'r2', user: 'u2', socket: 's3' });
    });

    it('Get an existing item', function () {
      const id = this.item.id;
      const item = this.con.get(id);
      expect(item).to.be.an('object');
      expect(item).to.eql(this.item);
    });

    it('An existing item gotten should be different from the original', function () {
      const id = this.item.id;
      const item = this.con.get(id);
      expect(item).to.not.equal(this.item);
    });

    it('Get an non-existent item should return falsy', function () {
      const item1 = this.con.get();
      expect(item1).to.be.falsy;

      const item2 = this.con.get('i1');
      expect(item2).to.be.falsy;
    });

    it('Get all items', function () {
      const items = this.con.getAll();
      expect(items).to.be.an('array').to.have.length(4);
    });

    it('Get items by socket', function () {
      const items = this.con.getBySocket('s1');
      expect(items).to.be.an('array').to.have.length(2);
    });

    it('Get items by room', function () {
      const items = this.con.getByRoom('r1');
      expect(items).to.be.an('array').to.have.length(3);
    });

    it('Get items by user', function () {
      const items = this.con.getByUser('u2');
      expect(items).to.be.an('array').to.have.length(2);
    });

    it('Remove item', function () {
      const { id } = this.con.add({
        room: 'rx1',
        user: 'ux1',
        socket: 'sx1',
      });
      expect(this.con.get(id)).to.be.an('object');
      this.con.remove(id);
      expect(this.con.get(id)).to.be.falsy;
    });

    it('Remove item by socket', function () {
      const items = this.con.getBySocket('s1');
      expect(items).to.be.an('array').to.have.length(2);
      this.con.removeBySocket('s1');
      expect(this.con.getBySocket('s1')).to.be.an('array').to.have.length(0);
    });

  });
});
