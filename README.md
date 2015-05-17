Boids (Flocking) Simulation
===================
Check out online: http://www.hamdikavak.com/sims/flocking/

Flocking behavior seems like a complex behavior at a glance. But it is actually an emergent behavior that is based on a simple three rules; separation, alignment and cohesion. These rules applied in a simulation first time by Craig Reynolds in 1985. He defined the rules in following way.

Separation: A bird should steer to avoid crowding local flockmates. Alignment: A bird should steer average heading of the local flockmates and keep the same speed with them. Cohesion: A bird should steer to move towards the average position of local flockmates.

This model implements these three rules to simulate flocking behavior. You can change environment size, population, vision range and minimum separation parameters. Vision range is the radius size of the circular area around each bird. Birds can only see other birds within their vision range. Minimum separation is the minimum length that two birds can get close to each other. When two birds get closer less than minimum separation length then separation rule supersedes the other two rules, otherwise alignment and cohesion rules are applied.

This simulation is built based on agent-based modeling paradigm and written in JavaScript language.
