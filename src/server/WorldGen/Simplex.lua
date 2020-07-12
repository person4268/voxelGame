
-- Script ported by Oysi

-- http://webstaff.itn.liu.se/~stegu/simplexnoise/SimplexNoise.java

local Simplex = {}

local grad3 = {
	{ 1, 1, 0}, {-1, 1, 0}, { 1,-1, 0}, {-1,-1, 0};
	{ 1, 0, 1}, {-1, 0, 1}, { 1, 0,-1}, {-1, 0,-1};
	{ 0, 1, 1}, { 0,-1, 1}, { 0, 1,-1}, { 0,-1,-1};
}

local p = {
	151,160,137, 91, 90, 15,131, 13,201, 95, 96, 53,194,233,  7,225,
	140, 36,103, 30, 69,142,  8, 99, 37,240, 21, 10, 23,190,  6,148,
	247,120,234, 75,  0, 26,197, 62, 94,252,219,203,117, 35, 11, 32,
	 57,177, 33, 88,237,149, 56, 87,174, 20,125,136,171,168, 68,175,
	 74,165, 71,134,139, 48, 27,166, 77,146,158,231, 83,111,229,122,
	 60,211,133,230,220,105, 92, 41, 55, 46,245, 40,244,102,143, 54,
	 65, 25, 63,161,  1,216, 80, 73,209, 76,132,187,208, 89, 18,169,
	200,196,135,130,116,188,159, 86,164,100,109,198,173,186,  3, 64,
	 52,217,226,250,124,123,  5,202, 38,147,118,126,255, 82, 85,212,
	207,206, 59,227, 47, 16, 58, 17,182,189, 28, 42,223,183,170,213,
	119,248,152,  2, 44,154,163, 70,221,153,101,155,167, 43,172,  9,
	129, 22, 39,253, 19, 98,108,110, 79,113,224,232,178,185,112,104,
	218,246, 97,228,251, 34,242,193,238,210,144, 12,191,179,162,241,
	 81, 51,145,235,249, 14,239,107, 49,192,214, 31,181,199,106,157,
	184, 84,204,176,115,121, 50, 45,127,  4,150,254,138,236,205, 93,
	222,114, 67, 29, 24, 72,243,141,128,195, 78, 66,215, 61,156,180,
}

local perm = {}
local permMod12 = {}

for i = 1, 512 do
	perm[i] = p[(i - 1)%256 + 1]
	permMod12[i] = perm[i] % 12
end

local F2 = 0.5*(math.sqrt(3) - 1)
local G2 = (3 - math.sqrt(3))/6
local F3 = 1/3
local G3 = 1/6

local function dot2(g, x, y) return g[1]*x + g[2]*y end
local function dot3(g, x, y, z) return g[1]*x + g[2]*y + g[3]*z end

function Simplex:noise2D(xin, yin)
	local n0, n1, n2

	local s = (xin + yin)*F2

	local i = math.floor(xin + s)
	local j = math.floor(yin + s)

	local t = (i + j)*G2

	local X0 = i - t
	local Y0 = j - t

	local x0 = xin - X0
	local y0 = yin - Y0

	local i1, j1
	if x0 > y0 then
		i1 = 1
		j1 = 0
	else
		i1 = 0
		j1 = 1
	end

	local x1 = x0 - i1 + G2
	local y1 = y0 - j1 + G2

	local x2 = x0 - 1 + 2*G2
	local y2 = y0 - 1 + 2*G2

	local ii = i % 256
	local jj = j % 256

	local gi0 = permMod12[ii + perm[jj + 1] + 1]
	local gi1 = permMod12[ii + i1 + perm[jj + j1 + 1] + 1]
	local gi2 = permMod12[ii + 1 + perm[jj + 1 + 1] + 1]

	local t0 = 0.5 - x0*x0 - y0*y0
	if t0 < 0 then
		n0 = 0
	else
		t0 = t0 * t0
		n0 = t0 * t0 * dot2(grad3[gi0 + 1], x0, y0)
	end

	local t1 = 0.5 - x1*x1 - y1*y1
	if t1 < 0 then
		n1 = 0
	else
		t1 = t1 * t1
		n1 = t1 * t1 * dot2(grad3[gi1 + 1], x1, y1)
	end

	local t2 = 0.5 - x2*x2 - y2*y2
	if t2 < 0 then
		n2 = 0
	else
		t2 = t2 * t2
		n2 = t2 * t2 * dot2(grad3[gi2 + 1], x2, y2)
	end

	return 70 * (n0 + n1 + n2)
end

function Simplex:noise3D(xin, yin, zin)
	local n0, n1, n2, n3

	local s = (xin + yin + zin)*F3

	local i = math.floor(xin + s)
	local j = math.floor(yin + s)
	local k = math.floor(zin + s)

	local t = (i + j + k)*G3

	local X0 = i - t
	local Y0 = j - t
	local Z0 = k - t

	local x0 = xin - X0
	local y0 = yin - Y0
	local z0 = zin - Z0

	local i1, j1, k1
	local i2, j2, k2

	if x0 >= y0 then
		if y0 >= z0 then
			i1=1 j1=0 k1=0 i2=1 j2=1 k2=0
		elseif x0 >= z0 then
			i1=1 j1=0 k1=0 i2=1 j2=0 k2=1
		else
			i1=0 j1=0 k1=1 i2=1 j2=0 k2=1
		end
	else
		if y0 < z0 then
			i1=0 j1=0 k1=1 i2=0 j2=1 k2=1
		elseif x0 < z0 then
			i1=0 j1=1 k1=0 i2=0 j2=1 k2=1
		else
			i1=0 j1=1 k1=0 i2=1 j2=1 k2=0
		end
	end

	local x1 = x0 - i1 + G3
	local y1 = y0 - j1 + G3
	local z1 = z0 - k1 + G3

	local x2 = x0 - i2 + 2*G3
	local y2 = y0 - j2 + 2*G3
	local z2 = z0 - k2 + 2*G3

	local x3 = x0 - 1 + 3*G3
	local y3 = y0 - 1 + 3*G3
	local z3 = z0 - 1 + 3*G3

	local ii = i % 256
	local jj = j % 256
	local kk = k % 256

	local gi0 = permMod12[ii + perm[jj + perm[kk + 1] + 1] + 1]
	local gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1 + 1] + 1] + 1]
	local gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2 + 1] + 1] + 1]
	local gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1 + 1] + 1] + 1]

	local t0 = 0.6 - x0*x0 - y0*y0 - z0*z0
	if t0 < 0 then
		n0 = 0
	else
		t0 = t0 * t0
		n0 = t0 * t0 * dot3(grad3[gi0 + 1], x0, y0, z0)
	end

	local t1 = 0.6 - x1*x1 - y1*y1 - z1*z1
	if t1 < 0 then
		n1 = 0
	else
		t1 = t1 * t1
		n1 = t1 * t1 * dot3(grad3[gi1 + 1], x1, y1, z1)
	end

	local t2 = 0.6 - x2*x2 - y2*y2 - z2*z2
	if t2 < 0 then
		n2 = 0
	else
		t2 = t2 * t2
		n2 = t2 * t2 * dot3(grad3[gi2 + 1], x2, y2, z2)
	end

	local t3 = 0.6 - x3*x3 - y3*y3 - z3*z3
	if t3 < 0 then
		n3 = 0
	else
		t3 = t3 * t3
		n3 = t3 * t3 * dot3(grad3[gi3 + 1], x3, y3, z3)
	end

	return 32.5*(n0 + n1 + n2 + n3)
end

return Simplex