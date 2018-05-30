import tensorflow as tf

data = [[.4, .4,  1., 0., 0.],
        [.4, .8,  0., 0., 1.]]

X = tf.constant(map(lambda x: [x[0], x[1]], data))

Y = tf.constant(
        map(lambda x: [0.1, 0.5] if x[2] == 1. else [0.8, 0.5], 
            data))

sess = tf.Session()

# layer 1
W1 = tf.Variable([[0.3, -0.1], [-0.2, 0.15]])
sess.run(W1.initializer)
b1 = tf.Variable([0.0, 0.0])
sess.run(b1.initializer)
L1 = tf.nn.relu(tf.add(tf.matmul(X, W1), b1))

# layer 2
W2 = tf.Variable([[0.3, -0.1], [-0.2, 0.15]])
sess.run(W2.initializer)
b2 = tf.Variable([0.0, 0.0])
sess.run(b2.initializer)
L2 = tf.nn.relu(tf.add(tf.matmul(X, W2), b2))

# layer 3
W3 = tf.Variable([[0.3, -0.1], [-0.2, 0.15]])
sess.run(W3.initializer)
b3 = tf.Variable([0.0, 0.0])
sess.run(b3.initializer)
L3 = tf.nn.relu(tf.add(tf.matmul(X, W3), b3))


pred = L3

cost = tf.reduce_mean(tf.pow(pred-Y, 2))

optimizer = tf.train.GradientDescentOptimizer(1e-1).minimize(cost)


for epoch in range(1000):
    sess.run(optimizer)
    print(sess.run(cost))
