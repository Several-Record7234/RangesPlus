uniform mat3 model;
uniform mat3 data1;
uniform mat3 data2;
uniform mat3 data3;
uniform mat3 data4;
uniform mat3 data5;
uniform float minFalloff;
uniform float maxFalloff;
uniform int type;
uniform int isometric;
uniform float yScale;

float circle(vec2 p) {
  return length(p);
}

float square(vec2 p) {
  return max(abs(p.x), abs(p.y));
}

float circleIso(vec2 p, float ys) {
  return length(vec2(p.x, p.y / ys));
}

float squareIso(vec2 p, float ys) {
  // Inverse of isometric square transform: undo y-scale then undo 45deg rotation
  float uy = p.y / ys;
  float c = 0.7071068; // cos(45) = sin(45) = sqrt(2)/2
  float rx =  c * p.x + c * uy;
  float ry = -c * p.x + c * uy;
  return max(abs(rx), abs(ry));
}

void addRing(inout vec3 color, inout float alpha, vec3 ringColor, float radius, float prevRadius, float dist) {
  if (radius <= 0.0) return;
  float outer = step(dist, radius);
  float inner = step(dist, prevRadius);
  float mask = outer - inner;
  float a = (dist - prevRadius) / (radius - prevRadius);
  float falloff = mix(minFalloff, maxFalloff, a);
  alpha += falloff * mask;
  color += mix(vec3(1, 1, 1), ringColor, falloff) * mask;
}

half4 main(float2 coord) {
  vec2 worldCoord = (model * vec3(coord, 1.0)).xy;
  float dist;
  if (isometric == 0) {
    dist = type == 0 ? circle(worldCoord) : square(worldCoord);
  } else {
    dist = type == 0 ? circleIso(worldCoord, yScale) : squareIso(worldCoord, yScale);
  }

  vec3 color = vec3(0.0);
  float alpha = 0.0;
  
  addRing(color, alpha, data1[1].rgb, data1[0].x, 0.0, dist);
  addRing(color, alpha, data1[2].rgb, data1[0].y, data1[0].x, dist);

  addRing(color, alpha, data2[1].rgb, data2[0].x, data1[0].y, dist);
  addRing(color, alpha, data2[2].rgb, data2[0].y, data2[0].x, dist);
  
  addRing(color, alpha, data3[1].rgb, data3[0].x, data2[0].y, dist);
  addRing(color, alpha, data3[2].rgb, data3[0].y, data3[0].x, dist);
  
  addRing(color, alpha, data4[1].rgb, data4[0].x, data3[0].y, dist);
  addRing(color, alpha, data4[2].rgb, data4[0].y, data4[0].x, dist);
  
  addRing(color, alpha, data5[1].rgb, data5[0].x, data4[0].y, dist);
  addRing(color, alpha, data5[2].rgb, data5[0].y, data5[0].x, dist);
  
  return half4(vec3(color) * alpha, alpha);
}