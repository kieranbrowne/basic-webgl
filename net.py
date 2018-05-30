import tensorflow as tf

data = [[.4, .4,  1., 0., 0.],
        [.4, .8,  0., 0., 1.]]

X = tf.constant(map(lambda x: [x[0], x[1]], data))

Y = tf.constant(
        map(lambda x: [0.1, 0.5] if x[2] == 1. else [0.8, 0.5], 
            data))

sess = tf.Session()

W0 = tf.Variable([[0.3, -0.1], [-0.2, 0.15]])
sess.run(W0.initializer)
b0 = tf.Variable([0.0, 0.0])
sess.run(b0.initializer)


pred = tf.nn.relu(tf.add(tf.matmul(X, W0), b0))

cost = tf.reduce_mean(tf.pow(pred-Y, 2))

optimizer = tf.train.GradientDescentOptimizer(1e-1).minimize(cost)


for epoch in range(1000):
    sess.run(optimizer)
    print(sess.run(cost))
